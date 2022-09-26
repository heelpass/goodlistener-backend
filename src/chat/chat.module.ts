import {Logger, Module} from '@nestjs/common';
import {ChatService} from './chat.service';
import {ChatGateway} from "./chat.gateway";
import {UserModule} from "../user/user.module";
import { ChatController } from './chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {ChannelEntity} from "../entity/channel";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChannelEntity])
    ,UserModule
    ,ConfigModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
