import { Body, Controller, Post, Get, Request, Delete } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  // // 없어질 API
  // @Post('/token/apple/access')
  // async getNewAccessToken(@Body() body: any): Promise<object> {
  //   const { token } = body;
  //   // const newAccessToken = await this.authService.getAccessToken(token);
  //   // return newAccessToken;
  //   return Promise.all('');
  // }

  // 회원가입
  @Post('/sign/apple')
  async oauthAppleSignIn(@Request() res: any, @Body() body: any): Promise<any> {
    const { token } = body;

      const appleToken = await this.authService.handleAppleLogin(token);

      const uuid = this.authService.verifyTokenInfo(appleToken.userInfo);

    const user = await this.userService.findByHash(uuid);

    const isExistUser = user !== null;

      return { token: appleToken.sendToken, isExistUser };
  }

  //회원정보 삭제
  @Delete('sign')
  async oauthAppleSignOut(): Promise<any> {
    return { result: true };
  }
}
