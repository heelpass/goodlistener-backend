import { Module } from '@nestjs/common';
import { PushLogService } from './push-log.service';
import { PushLogController } from './push-log.controller';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushLog } from 'src/entity/PushLog';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PushLog]),
  ],
  providers: [PushLogService, UserService, PushLog],
  controllers: [PushLogController],
})
export class PushLogModule {}
