import {IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class AuthDto {

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}
