import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { Fcm } from './util/notification/firebase/message/fcm';
import { PushLogModule } from './push-log/push-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        '.env.' +
        (process.env.NODE_ENV === undefined ? 'local' : process.env.NODE_ENV),
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/entity/*{.ts,.js}'],
      synchronize: false,
      logging: false,
    }),
    AuthModule,
    UserModule,
    MatchModule,
    PushLogModule,
    ChatModule,
  ],
  providers: [Fcm],
  // providers: [AppService, AuthService, UserService],
  // controllers: [AppController, AuthController, UserController],
})
export class AppModule implements NestModule {
  constructor(private fcm: Fcm) {}

  configure(consumer: MiddlewareConsumer) {
    this.fcm.init();
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/sign/apple', method: RequestMethod.POST },
        { path: '/user/valid', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
