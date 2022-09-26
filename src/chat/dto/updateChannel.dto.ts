import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class updateChannelDto {
  @IsNumber()
  @IsNotEmpty()
  speakerId: number;

  @IsNumber()
  @IsNotEmpty()
  listenerId: number;

  @IsBoolean()
  @IsNotEmpty()
  isListenerIn: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isSpeakerIn: boolean;

  @IsString()
  @IsNotEmpty()
  meetingTime: string;
}