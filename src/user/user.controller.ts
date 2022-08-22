import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { SignInUserDto } from "./dto/signIn-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/signup")
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(
      body.snsHash,
      body.snsKind,
      body.email,
      body.nickname,
      body.gender,
      body.ageRange,
      body.job,
      body.fcmHash
    );
    return user;
  }

  @Get("/")
  checkNickName(@Query("nickname") nickname: string) {
    return this.userService.checkNickName(nickname);
  }

  @Post("/signin")
  async signin(@Body() body: SignInUserDto) {
    const user = await this.userService.findOne(body.id);
    return user;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("user not found with id = " + id);
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query("email") email: string) {
    return await this.userService.find(email);
  }

  @Delete("/:id")
  async removeUser(@Param("id") id: string) {
    return await this.userService.remove(parseInt(id));
  }

  @Patch("/:id")
  async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(parseInt(id), body);
  }
}
