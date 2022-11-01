import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as qs from 'qs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  // 회원가입 시 사용
  async handleAppleLogin(token: string): Promise<any> {
    const url = 'https://appleId.apple.com/auth/token';
    const httpOption = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const body = {
      client_id: this.configService.get<string>('APPLE_CLIENT_ID'),
      client_secret: this.configService.get<string>('APPLE_CLIENT_SECRET'),
      code: token,
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(url, qs.stringify(body), httpOption);
      const { refresh_token, id_token } = response.data;

      if (response.data?.error === 'invalid_grant') {
        throw new ConflictException('잘못된 토큰입니다.');
      }

      return { sendToken: refresh_token, userInfo: id_token };
    } catch (err) {
      if (err.code === 'ERR_BAD_REQUEST') {
        throw new UnauthorizedException('잘못된 토큰입니다.');
      }
    }
  }

  async getAccessToken(refreshToken: string): Promise<object> {
    console.log('getAccessToken');
    const url = 'https://appleid.apple.com/auth/token';

    const httpOption = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const body = {
      client_id: this.configService.get<string>('APPLE_CLIENT_ID'),
      client_secret: this.configService.get<string>('APPLE_CLIENT_SECRET'),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    try {
      const response = await axios.post(url, qs.stringify(body), httpOption);

      const accessToken = response.data.refresh_token;
      return { accessToken };
    } catch (err) {
      console.log(err.message);
      return err;
    }
  }

  verifyTokenInfo(token: any): any {
    const tokenInfo = jwt.decode(token);
    const { sub } = tokenInfo;

    return sub;
  }
}
