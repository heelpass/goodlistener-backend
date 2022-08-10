import { Body, Controller, Post, Get, Request, Delete } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token/apple/access')
  async getNewAccessToken(@Body() body: any): Promise<object> {
    const { token } = body;
    const newAccessToken = await this.authService.getAccessToken(token);
    return newAccessToken;
  }

  @Post('/sign/apple')
  async oauthAppleSignIn(
    @Request() res: any,
    @Body() body: any
  ): Promise<string> {
    console.log(res.user);
    const { token } = body;
    const result = await this.authService.handleAppleLogin(token);

    return result.accessToken;
  }
  @Delete('sign')
  async oauthAppleSignOut(): Promise<any> {
    return { result: true };
  }
}
