import { Logger, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { ChannelEntity } from '../entity/channel';
import { ConfigModule } from '@nestjs/config';
import { Fcm } from '../util/notification/firebase/message/fcm';
import { PushLogService } from 'src/push-log/push-log.service';
import { PushLog } from '../entity/PushLog';
import { MatchService } from 'src/match/match.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChannelEntity, PushLog]),
    UserModule,
    ConfigModule,
  ],
  providers: [
    ChatService,
    ChatGateway,
    Fcm,
    PushLogService,
    MatchService,
    UserService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
