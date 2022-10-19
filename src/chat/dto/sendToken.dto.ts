import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class sendTokenDto {
  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublisher: boolean;

  @IsNumber()
  channeId: number;
}