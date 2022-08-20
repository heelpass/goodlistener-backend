import { IsNumber, IsOptional, IsString } from "class-validator";
import { KindEntity } from "../../entity/kind";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  ageRange: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsString()
  @IsOptional()
  fcmHash: string;

  @IsNumber()
  @IsOptional()
  kind: KindEntity;
}
