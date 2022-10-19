import {OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer,} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ChatService} from './chat.service';
import {chatRoomSetInitDto} from "./dto/chatRoom-setInit.dto";
import {UserService} from "../user/user.service";
import {Fcm} from "../util/notification/firebase/message/fcm";

@WebSocketGateway(5000, {
  cors: {
    origin: 'http://localhost:31081',
  },
})
export class ChatGateway
  // implements OnGatewayConnection, OnGatewayDisconnect
  implements OnGatewayDisconnect {
  constructor(private readonly chatRoomService: ChatService,
              private userService: UserService,
              private fcm: Fcm) {
  }

  @WebSocketServer()
  server: Server;

  //소켓 연결시 유저목록에 추가
  public handleConnection(client: Socket): void {
    // console.log("Im in!!")
  }

  //소켓 연결 해제시 유저목록에서 제거
  public handleDisconnect(client: Socket): string {
    const {userId, room} = client.data;
    console.log(`userId ${userId}가 방 ${room}에서 종료하였습니다`)
    return `userId ${userId}가 방 ${room}에서 종료하였습니다`;
  }

  //메시지가 전송되면 모든 유저에게 메시지 전송
  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    const {roomId} = client.data;
    client.to(roomId).emit('getMessage', {
      id: client.id,
      nickname: client.data.nickname,
      message,
    });
  }

  //처음 접속시 유저의 데이터 세팅
  @SubscribeMessage('setUserIn')
  async setUserIn(client: Socket, data: chatRoomSetInitDto): Promise<any> {
    const userId = data.isListener === true ? data.listenerId : data.speakerId;
    const user = await this.userService.findOne(userId);
    // 리스너의 아이디를 가져와서 생성한다.
    client.data.userId = userId;
    client.data.fcmHash = user.fcmHash;
    client.data.listenerId = data.listenerId;
    client.data.speakerId = data.speakerId;
    client.data.kindId = user.kind.id;
    client.data.nickName = user.nickname;
    client.data.room = data.channel;
    client.data.meetingTime = data.meetingTime;
    //리스너 인지 확인후 DB에 channel 에 업데이트
    if (user.kind.id === 1) {
      await this.chatRoomService.updateChannelInfo(data.speakerId, data.listenerId, false, true, data.meetingTime);
      // fcm 토큰으로 스피커에게 알림보내기
      await this.fcm.pushMessage(user.fcmHash,'Call',`리스너(${data.listenerId})가 스피커(${data.speakerId})에게 전화를 겁니다`, '');
    }

    if (user.kind.id === 0) {
      await this.chatRoomService.updateChannelInfo(data.speakerId, data.listenerId, true, false, data.meetingTime);
      await this.fcm.pushMessage(user.fcmHash,'SpeakerIn',`리스너(${data.listenerId})가 건 전화를 스피커(${data.speakerId})가 받았습니다.`, '');
    }

    const message = user.kind.id === 1 ? `userId : ${(userId)}번이  방 ${data.channel}를 만들었습니다` : `userId : ${(userId)}번이  접속했습니다.`;
    console.log(message);
    const returnMessage = {
      nickname: user.nickname,
      id: userId,
      room: data.channel,
      message: message
    };
    client.emit('setUserIn', returnMessage);
    return {
      nickname: user.nickname,
      id: userId,
      room: data.channel,
      message: message
    };
  }

  //종료시
  @SubscribeMessage('disconnected')
  disconnectedUser(client: Socket): void {
    // this.chatRoomService.exitChatRoom(client, client.data.room);
    client.emit('disconnected', this.chatRoomService.exitChatRoom(client, client.data.room));
    client.disconnect(true);
  }

  //채팅방 목록 가져오기
  @SubscribeMessage('getChatRoomList')
  getChatRoomList(client: Socket, payload: any) {
    client.emit('getChatRoomList', this.chatRoomService.getChatRoomList());
  }

  //채팅방 생성하기
  @SubscribeMessage('createChatRoom')
  createChatRoom(client: Socket) {
    client.emit('createChatRoom', this.chatRoomService.createChatRoom(client));
    // return this.chatRoomService.createChatRoom(client);
  }

  //채팅방 들어가기
  @SubscribeMessage('enterChatRoom')
  enterChatRoom(client: Socket, payload: any) {
    client.emit('enterChatRoom', this.chatRoomService.enterChatRoom(client));
    return this.chatRoomService.enterChatRoom(client);
  }

  //Agora 토큰 생성
  @SubscribeMessage('createAgoraToken')
  async getAgoraToken(client: Socket) {
    const {AGORA_APP_ID, AGORA_APP_CERTIFICATE} = process.env;
    const {room, fcmHash} = client.data;
    const token = await this.chatRoomService.sendAgoraWebToken(AGORA_APP_ID, AGORA_APP_CERTIFICATE, true, room);
    console.log("token = " + token)
    client.emit('createAgoraToken', token);
    await this.fcm.pushMessage(fcmHash,'AgoraToken',`리스너가 생성한 아고라 토큰을 스피커에게 보냅니다`, token);
    return token;
  }
}