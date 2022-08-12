import {Module,} from '@nestjs/common';
import {AppController} from './app.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppService} from './app.service';
import {AuthService} from './auth/auth.service';
import {AuthController} from './auth/auth.controller';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {UserEntity} from "./entitys/user";
import {KindEntity} from "./entitys/kind";
import {ChannelEntity} from "./entitys/channel";

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
      entities: [__dirname + '/**/entitys/*{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [AppService, AuthService],
  controllers: [AppController, AuthController],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude({ path: '/apple/login', method: RequestMethod.POST },
//         { path: '', method: RequestMethod.GET })
//       .forRoutes('*');
//   }
// }

export class AppModule {}
