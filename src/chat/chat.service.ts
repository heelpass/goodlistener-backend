import {Injectable} from '@nestjs/common';
import {chatRoomListDTO} from './dto/chatRoomList.dto';
import {Socket} from 'socket.io';
import {InjectRepository} from "@nestjs/typeorm";
import {ChannelEntity} from "../entity/channel";
import {Repository} from "typeorm";
import {UserEntity} from "../entity/user.entity";
import * as Agora from 'agora-access-token';

@Injectable()
export class ChatService {
  private readonly chatRoomList: Record<string, any>;

  constructor(@InjectRepository(ChannelEntity) private channelRepo: Repository<ChannelEntity>,
              @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {
    this.chatRoomList = {};
  }

  createChatRoom(client: Socket): String {
    const { listenerId, speakerId, room, meetingTime, userId, nickName } = client.data;
    this.chatRoomList[listenerId] = {
      [speakerId]: {
        room: room,
        meetingTime: meetingTime
      }
    };

    client.rooms.clear();
    client.join(room);
    client.to(room).emit('getMessage', {
      id: userId,
      nickname: nickName,
      message:
        `리스너 유저 ID ${listenerId} 님이 Room : ${room}을 생성하셨습니다.`,
    });
    console.log(`리스너 유저 ID ${listenerId} 님이 Room : ${room}을 생성하셨습니다.`);

    return `리스너 유저 ID ${listenerId} 님이 Room : ${room}을 생성하셨습니다.`;
  }

  enterChatRoom(client: Socket) {
    // client.data.channel = channel;
    client.rooms.clear();
    const { listenerId, speakerId, room, meetingTime, userId, nickName } = client.data;
    client.join(room);
    const enterUserName = userId === speakerId ? speakerId : listenerId;
    const chatRoom = this.getChatRoom(listenerId, speakerId);
    const message = `"${enterUserName}"님이 "${chatRoom}"방에 접속하셨습니다.`;
    client.to(room).emit('getMessage', {
      id: enterUserName,
      message: message,
    });
    console.log(`"UserId가 ${enterUserName}"님이 "${room}"방에 접속하셨습니다.`);
    return {
      id: enterUserName,
      message: message,
    };
  }

  exitChatRoom(client: Socket, roomId: string) {
    client.rooms.clear();
    const {userId, nickname, room, listenerId} = client.data;
    console.log("this.chatRoomList[listenerId] = " + JSON.stringify(this.chatRoomList));
    delete this.chatRoomList[listenerId];
    console.log("this.chatRoomList[listenerId] = " + JSON.stringify(this.chatRoomList));
    console.log(`userId가 ${userId}인 님이 방 ${room}을 나갔습니다.`)
    return {
      id: userId,
      nickname: nickname,
      message: `userId가 ${userId}인 님이 방 ${room}을 나갔습니다.`,
    };
    // client.to(roomId).emit('getMessage', {
    //   id: userId,
    //   nickname: nickname,
    //   message: `userId가 ${userId}인 님이 방 ${room}을 나갔습니다.`,
    // });
  }

  getChatRoom(listenerId: number, speakerId:number): chatRoomListDTO {
    const chatRoomListElement = this.chatRoomList[listenerId];
    console.log("chatRoomListElement = " + JSON.stringify(chatRoomListElement));
    return chatRoomListElement[speakerId].room;
  }

  getChatRoomList(): Record<string, chatRoomListDTO> {
    console.log("채팅방 룸 리스트 조회 = " + JSON.stringify(this.chatRoomList));
    return this.chatRoomList;
  }

  deleteChatRoom(roomId: string) {
    delete this.chatRoomList[roomId];
  }

  async updateChannelInfo(speakerId: number, listenerId: number, isSpeakerIn: boolean, isListenerIn: boolean, meetingTime: string): Promise<void> {
    if (speakerId && listenerId) {
      const findChannel = await this.channelRepo.createQueryBuilder('c')
        .where('c.speakerId = :speakerId', {speakerId: speakerId})
        .andWhere('c.listenerId = :listenerId', {listenerId: listenerId})
        .andWhere('c.meetingTime = :meetingTime', {meetingTime: meetingTime})
        .getOne();

      // 리스너가 전화를 걸때 Channel에 업데이트
      if (isListenerIn) {
        await this.channelRepo.createQueryBuilder()
          .update(findChannel)
          .where({id: findChannel.id})
          .set({isListenerIn: true})
          .execute();
      }

      // 스피커가 전화를 받을때 Channel에 업데이트
      if (isSpeakerIn) {
        await this.channelRepo.createQueryBuilder()
          .update(findChannel)
          .where({id: findChannel.id})
          .set({isSpeakerIn: true})
          .execute();
      }
    }
  }

  async sendAgoraWebToken(appID: string, appCertificate: string, isPublisher: boolean, channel: string): Promise<string> {
    const uid = Math.floor(Math.random() * 100000);
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const role = isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
    return Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, privilegeExpiredTs);
  }
}
