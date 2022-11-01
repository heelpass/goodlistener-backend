import { IsString } from 'class-validator';

export class ReadPushDto {
  @IsString()
  messageHash: string;
}
