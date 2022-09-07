import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {MatchService} from "./match.service";
import {applyMatchDto} from "./dto/apply-match.dto";
import {UserEntity} from "../entity/user.entity";

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {
  }

  @Post('/user')
  async matchUser(@Body() body: applyMatchDto) {
    let matchedUser: UserEntity;
    for (let i = 0; i < body.matchDate.length; i++) {
      const possibleUsers = await this.matchService.matchListener(body.matchDate[i]);
      if (possibleUsers.length > 1) {
        matchedUser = await this.matchService.randomUserMatch(possibleUsers);
      } else {
        matchedUser = possibleUsers[0];
      }
      if (matchedUser) {
        return await this.matchService.insertChannel(body.id, matchedUser.id, body.matchDate[i], body.applyDesc);
      }
    }
    return '매칭된 유저가 없습니다';
  }

  @Get('/user/listener')
  async getMyListener(@Query('id') id: number) {
    const myListener = await this.matchService.getMyListener(id);
    if(myListener) {
      return myListener;
    } else {
      return '당신의 리스너가 없습니다'
    }
  }


  @Get('/user/speaker')
  async getMySpeaker(@Query('id') id: number) {
    const mySpeakers = await this.matchService.getMySpeaker(id);
    if(mySpeakers.length > 0) {
      return mySpeakers;
    } else {
      return '당신의 스피커가 없습니다'
    }
  }
}
