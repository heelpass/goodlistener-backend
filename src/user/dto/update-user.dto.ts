import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { KindEntity } from '../../entity/kind';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  @IsEnum(['10', '20', '30', '40'])
  ageRange: string;

  @IsString()
  @IsOptional()
  @IsEnum(['student', 'worker', 'freelancer', 'jobseeker', 'etc'])
  job: string;

  @IsString()
  @IsOptional()
  fcmHash: string;

  @IsNumber()
  @IsOptional()
  @IsEnum([0, 1, 2, 3, 4, 5, 6, 7, 8])
  profileImg: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  kind: KindEntity;
}
