import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { applyMatchDto } from './dto/apply-match.dto';
import { UserEntity } from '../entity/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('match')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private userService: UserService
  ) {}

  @Post('/user')
  async matchUser(@Request() res: any, @Body() body: applyMatchDto) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);
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
    throw new NotFoundException('매칭된 유저가 없습니다');
  }

  @Get('/user/listener')
  async getMyListener(@Request() res: any) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);

    const myListener = await this.matchService.getMyListener(user.id);

    if (myListener === null || myListener === undefined) {
      throw new NotFoundException('당신의 리스너가 없습니다');
    }

    return myListener;
  }

  @Get('/user/speaker')
  async getMySpeaker(@Request() res: any) {
    const userHash = res.user;

    const user = await this.userService.findByHash(userHash);

    const mySpeakers = await this.matchService.getMySpeaker(user.id);

    if (mySpeakers.length <= 0) {
      throw new NotFoundException('당신의 스피커가 없습니다');
    }

    return mySpeakers;
  }
}
