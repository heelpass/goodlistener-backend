import {Body, Controller, Patch, Post} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {ConfigService} from "@nestjs/config";
import {sendTokenDto} from "./dto/sendToken.dto";
import {updateChannelDto} from "./dto/updateChannel.dto";

@Controller('chat')
export class ChatController {

  constructor(private chatService: ChatService,
              private configService: ConfigService) {
  }

  @Post('/token')
  async sendAgoraToken(@Body() body: sendTokenDto) {
    const appId = this.configService.get('AGORA_APP_ID');
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE');
    const {isPublisher, channel, channeId} = body;
    return this.chatService.sendAgoraWebToken(appId, appCertificate, isPublisher, channel, channeId);
  }

  @Patch('/channel')
  async updateChannel(@Body() body: updateChannelDto) {
    const {speakerId, listenerId, isSpeakerIn, isListenerIn, meetingTime} = body;
    return this.chatService.updateChannelInfo(speakerId, listenerId, isSpeakerIn, isListenerIn, meetingTime);
  }
}
