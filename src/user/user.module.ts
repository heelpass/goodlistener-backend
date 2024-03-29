import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity } from "../entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, UserEntity],
  controllers: [UserController],
  exports: [UserEntity, UserService]
})
export class UserModule {}
