import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsDate, IsEnum, IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
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
