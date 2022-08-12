import { Body, Controller, Post, Get, Request, Delete } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/apple/token/access")
  async getNewAccessToken(@Body() body: any): Promise<object> {
    const { token } = body;
    const newAccessToken = await this.authService.getAccessToken(token);
    return newAccessToken;
  }

  @Post("/apple/login")
  async oauthAppleSignIn(
    @Request() res: any,
    @Body() body: any
  ): Promise<string> {
    console.log(res.user);
    const { token } = body;
    const result = await this.authService.handleAppleLogin(token);

    return result.accessToken;
  }
  @Delete("apple/login")
  async oauthAppleSignOut(): Promise<boolean> {
    return true;
  }
}
