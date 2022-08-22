import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (authorization === undefined)
      throw new UnauthorizedException("토큰을 찾을 수 없습니다.");

    const token = authorization.split(" ")[1];

    if (!token) throw new UnauthorizedException("토큰을 찾을 수 없습니다.");

    try {
      const tokenInfo = jwt.decode(token);
      if (tokenInfo === null) {
        throw new ForbiddenException("잘못된 토큰입니다.");
      }
      const userHash = this.verifyTokenInfo(tokenInfo);
      console.log(tokenInfo);
      req.user = userHash;

      next();
    } catch (err) {
      throw new ForbiddenException("잘못된 토큰입니다.");
    }
  }

  verifyTokenInfo(tokenInfo: any) {
    const { iss, aud, sub, at_hash, email, exp, iat, auth_time } = tokenInfo;
    const clientId = this.configService.get<string>("APPLE_CLIENT_ID");
    console.log(new Date(exp).toUTCString());
    console.log(new Date(iat).toUTCString());
    console.log(new Date(auth_time).toUTCString());
    if (aud === clientId) {
      return at_hash;
    }
  }
}
