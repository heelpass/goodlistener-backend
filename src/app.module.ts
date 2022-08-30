import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ".env." +
        (process.env.NODE_ENV === undefined ? "local" : process.env.NODE_ENV),
    }),
    TypeOrmModule.forRoot({
      type: "mariadb",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/entity/*{.ts,.js}"],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
  ],
  // providers: [AppService, AuthService, UserService],
  // controllers: [AppController, AuthController, UserController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/sign/apple', method: RequestMethod.POST },
        { path: '/user/valid', method: RequestMethod.GET }
        //   'user/(.*)',
        //   'user'
      )
      .forRoutes('*');
  }
}
