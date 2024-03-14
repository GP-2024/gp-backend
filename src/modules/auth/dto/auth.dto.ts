import {IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsDate, IsEnum, IsNumber, IsOptional, MinLength } from "class-validator";
import { Transform } from "class-transformer";

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

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  country?: string;

  @IsNotEmpty()
  @IsString()
  password: string;



}



