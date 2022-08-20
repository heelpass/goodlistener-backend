import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as qs from "qs";

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  // 회원가입 시 사용
  async handleAppleLogin(token: string): Promise<any> {
    const url = "https://appleId.apple.com/auth/token";
    const httpOption = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    const body = {
      client_id: this.configService.get<string>("APPLE_CLIENT_ID"),
      client_secret: this.configService.get<string>("APPLE_CLIENT_SECRET"),
      code: token,
      grant_type: "authorization_code",
    };

    try {
      const response = await axios.post(url, qs.stringify(body), httpOption);
      const { refresh_token, id_token } = response.data;

      if (response.data?.error === "invalid_grant") {
        throw new ConflictException("잘못된 토큰입니다.");
      }

      return { sendToken: refresh_token, userInfo: id_token };
    } catch (err) {
      if (err.message === undefined) {
        throw new UnauthorizedException("잘못된 유저의 정보입니다.");
      }
    }
  }

  async getAccessToken(refreshToken: string): Promise<object> {
    const url = "https://appleid.apple.com/auth/token";

    const httpOption = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    const body = {
      client_id: this.configService.get<string>("APPLE_CLIENT_ID"),
      client_secret: this.configService.get<string>("APPLE_CLIENT_SECRET"),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    };

    try {
      const response = await axios.post(url, qs.stringify(body), httpOption);
      console.log(response.data);
      const accessToken = response.data.refresh_token;
      return { accessToken };
    } catch (err) {
      console.log(err.message);
    }
  }

  async validAccessToken(accessToken: string) {
    console.log(accessToken);
  }
}
