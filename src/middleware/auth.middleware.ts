import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (authorization === undefined)
      throw new UnauthorizedException('토큰을 찾을 수 없습니다.');

    const token = authorization.split(' ')[1];

    if (!token) throw new UnauthorizedException('토큰을 찾을 수 없습니다.');

    try {
      console.log(token);
      const result = await this.validateAppleToken(token);

      const userHash = this.verifyTokenInfo(result.userInfo);

      console.log(userHash);
      req.user = userHash;
      next();
    } catch (err) {
      // throw new ForbiddenException('잘못된 토큰입니다.');
      next(err);
    }
  }

  verifyTokenInfo(token: any) {
    const tokenInfo = jwt.decode(token);
    console.log(tokenInfo);
    const { sub } = tokenInfo;
    // const clientId = this.configService.get<string>('APPLE_CLIENT_ID');

    return sub;
  }

  async validateAppleToken(token: string): Promise<any> {
    const url = 'https://appleId.apple.com/auth/token';
    const httpOption = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    const body = {
      client_id: this.configService.get<string>('APPLE_CLIENT_ID'),
      client_secret: this.configService.get<string>('APPLE_CLIENT_SECRET'),
      refresh_token: token,
      grant_type: 'refresh_token',
    };

    try {
      const response = await axios.post(url, qs.stringify(body), httpOption);
      const { refresh_token, id_token } = response.data;

      console.log(response.data);
      return { sendToken: refresh_token, userInfo: id_token };
    } catch (err) {
      console.log(err);
      if (err.code === 'ERR_BAD_REQUEST') {
        throw new ConflictException('잘못된 토큰입니다.');
      }
    }
  }
}
