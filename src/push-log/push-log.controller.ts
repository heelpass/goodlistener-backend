import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ReadPushDto } from './dto/ReadPushDto';
import { PushLogService } from './push-log.service';

@Controller('log/push')
export class PushLogController {
  constructor(
    // @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    private userService: UserService,
    private pushLogService: PushLogService
  ) {}

  @Post('/')
  async readPush(@Request() req, @Body() readPush: ReadPushDto) {
    const user = await this.userService.findByHash(req.user);
    await this.pushLogService.readPush(user.fcmHash, readPush.messageHash);
    return true;
  }

  @Get('/')
  async notReadPush(@Request() req) {
    const user = await this.userService.findByHash(req.user);
    return await this.pushLogService.notReadPush(user.fcmHash);
  }
}
