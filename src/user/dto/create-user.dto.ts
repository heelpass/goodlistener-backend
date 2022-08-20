import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  snsHash: string;

  @IsString()
  snsKind: string;

  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  gender: string;

  @IsString()
  ageRange: string;

  @IsString()
  job: string;

  @IsString()
  fcmHash: string;
}
