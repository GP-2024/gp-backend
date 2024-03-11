import {IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsDate, IsEnum, IsNumber, IsOptional, MinLength } from "class-validator";

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}


export class AuthDto {

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsEnum(Gender)
  gender: string;

  @IsDate()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  passwordHash : string

  @IsString()
  PasswordSalt : string

  @IsNumber()
  HashAlgorithmId : number

}



