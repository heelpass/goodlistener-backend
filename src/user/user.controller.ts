import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { SignInUserDto } from './dto/signIn-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { resourceLimits } from 'worker_threads';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign')
  async createUser(@Request() res: any, @Body() body: CreateUserDto) {
    console.log(res.user);
    const user = await this.userService.create(
      res.user,
      body.snsKind || 'apple',
      body.email || '',
      body.nickname,
      body.gender,
      body.ageRange,
      body.job,
      body.fcmHash
    );
    return user;
  }

  @Get('/valid')
  async checkNickName(@Query('nickName') nickName: string): Promise<any> {
    console.log(nickName);
    const result = await this.userService.checkNickName(nickName);
    return { isExist: result };
  }

  @Get('/')
  async getUserInfo(@Request() res: any) {
    const hash = res.user;
    const user = await this.userService.findByHash(hash);
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    // const user = await this.userService.findOne(userId);
    return user;
  }

  // @Get('/:id')
  // async findUser(@Param('id') id: string) {
  //   const user = await this.userService.findOne(parseInt(id));
  //   if (!user) {
  //     throw new NotFoundException('user not found with id = ' + id);
  //   }
  //   return user;
  // }

  // @Get()
  // async findAllUsers(@Query('email') email: string) {
  //   return await this.userService.find(email);
  // }

  @Delete('/')
  async removeUser(@Request() req: any) {
    const hash = req.user;
    const user = await this.userService.findByHash(hash);
    if (user === null) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return await this.userService.remove(user.id);
  }

  @Patch('/')
  async updateUser(@Request() req: any, @Body() body: UpdateUserDto) {
    const haah = req.user;
    const user = await this.userService.findByHash(haah);
    return await this.userService.update(user.id, body);
  }
}
