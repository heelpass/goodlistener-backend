import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class sendTokenDto {
  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublisher: boolean;
}