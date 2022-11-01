import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from "socket.io";

@WebSocketGateway(8080, { transports: ['websocket']})
export class EventGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('ClientToServer')
  async handleMessage(@MessageBody() data): Promise<void> {
    this.server.emit('ServerToClient', data);
    console.log(data);
    // return 'Hello world!';
  }
}
