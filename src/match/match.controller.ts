import {Body, Controller, Get, NotFoundException, Patch, Post, Request, UnauthorizedException,} from '@nestjs/common';
import {MatchService} from './match.service';
import {applyMatchDto} from './dto/apply-match.dto';
import {UserEntity} from '../entity/user.entity';
import {UserService} from 'src/user/user.service';

@Controller('match')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private userService: UserService
  ) {
  }

  @Post('/user')
  async matchUser(@Request() res: any, @Body() body: applyMatchDto) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);
    if (user.kind.id === 0) {
      let matchedUser: UserEntity;
      for (let i = 0; i < body.matchDate.length; i++) {
        const possibleUsers = await this.matchService.matchListener(
          body.matchDate[i]
        );

        if (possibleUsers.length > 1) {
          matchedUser = await this.matchService.randomUserMatch(possibleUsers);
        } else {
          matchedUser = possibleUsers[0];
        }

        if (matchedUser) {
          return await this.matchService.insertChannel(
            user.id,
            matchedUser.id,
            body.matchDate[i],
            body.applyDesc
          );
        }
      }
    } else {
      throw new UnauthorizedException('권한이 없는 사용자입니다');
    }
    throw new NotFoundException('매칭된 유저가 없습니다');
  }

  @Get('/user/listener')
  async getMyListener(@Request() res: any) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);
    if (user.kind.id === 0) {
      const myListener = await this.matchService.getMyListener(user.id);

      if (myListener === null || myListener === undefined) {
        throw new NotFoundException('당신의 리스너가 없습니다');
      }

      return myListener;
    } else {
      throw new UnauthorizedException('권한이 없는 사용자입니다');
    }

  }

  @Get('/user/speaker')
  async getMySpeaker(@Request() res: any) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);

    if (user.kind.id === 1) {
      const mySpeakers = await this.matchService.getMySpeaker(user.id);

      if (mySpeakers.length <= 0) {
        throw new NotFoundException('당신의 스피커가 없습니다');
      }

      return mySpeakers;
    } else {
      throw new UnauthorizedException('권한이 없는 사용자입니다');
    }
  }

  @Get('/channel')
  async getMyChannel(@Request() req: any) {
    const userHash = req.user;
    const user = await this.userService.findByHash(userHash);
    return this.matchService.getMyChannel(user.id, user.kind.id);
  }

  @Patch('/channel')
  async updateChannelDelete(@Body() body: any) {
    if(body.channelId) {
      await this.matchService.updateChannelDeletedAt(body.channelId);
    } else {
      throw new NotFoundException('채널 아이디를 입력해주세요.');
    }
  }
}
