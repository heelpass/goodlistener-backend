import { Module } from '@nestjs/common';
import { PushLogService } from './push-log.service';
import { PushLogController } from './push-log.controller';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushLog } from 'src/entity/PushLog';
import { Fcm } from 'src/util/notification/firebase/message/fcm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PushLog]),
  ],
  providers: [PushLogService, UserService, PushLog, Fcm],
  controllers: [PushLogController],
})
export class PushLogModule {}
