import {IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class applyMatchDto {
  @IsEnum([1, 2, 3, 4, 5, 6, 7, 8, 9])
  wantImg: number;

  @IsString()
  applyDesc: string;

  @IsDate({ message: '$property must be a Date type Array' })
  matchDate: Date[];
}
