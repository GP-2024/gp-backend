import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsDate, IsEnum, IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class UpdateProfileDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
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
  @IsOptional()
  gender: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  @IsOptional()
  country?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  password: string;
}
