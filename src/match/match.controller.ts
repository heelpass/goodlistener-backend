import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {MatchService} from "./match.service";
import {applyMatchDto} from "./dto/apply-match.dto";
import {UserEntity} from "../entity/user.entity";

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Post('/user')
  async matchUser(@Body() body: applyMatchDto) {
    let matchedUser:UserEntity;
    const possibleUsers = await this.matchService.matchListener(body.matchDate);
    console.log("possibleUsers = " + JSON.stringify(possibleUsers));
    if (possibleUsers.length > 1) {
       matchedUser = await this.matchService.randomUserMatch(possibleUsers);
    } else {
       matchedUser = possibleUsers[0];
    }
    if(matchedUser) {
      return await this.matchService.insertChannel(body.id, matchedUser.id, body.matchDate, body.applyDesc)
      // 유저가 뽑혔다면 channel에 스피커와 리스너의 정보들을 등록한다.
    } else {
      // 아니면 매칭 실패 메시지 출력
      return '매칭된 유저가 없습니다';
    }
  }

  @Get('/user/listener')
  async getMyListener(@Param('id') id: number){
    return await this.matchService.getMyListener(id);
  }


  // @Get('/user/speaker')
  // async getMySpeaker(@Param('id') id: number) {
  //   return await this.matchService.getMySpeaker(id);
  // }
}
