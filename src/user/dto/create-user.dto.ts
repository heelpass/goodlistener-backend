import { IsEmail, IsEnum, isIn, IsNumber, IsString } from 'class-validator';

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
  @IsEnum(['mail', 'female'])
  gender: string;

  @IsString()
  @IsEnum(['10', '20', '30', '40'])
  ageRange: string;

  @IsString()
  @IsEnum(['student', 'worker', 'freelancer', 'jobseeker', 'etc'])
  job: string;

  @IsNumber()
  @IsEnum([0, 1, 2, 3, 4, 5, 6, 7, 8])
  profileImg: number;

  @IsString()
  description: string;

  @IsString()
  fcmHash: string;
}
