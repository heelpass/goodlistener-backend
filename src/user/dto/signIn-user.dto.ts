import { IsNotEmpty, IsNumber } from "class-validator";

export class SignInUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
