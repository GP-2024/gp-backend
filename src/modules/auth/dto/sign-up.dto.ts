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
  username: string;

  @IsString()
  @Min(3)
  @Max(15)
  firstName: string;

  @IsString()
  @Min(3)
  @Max(15)
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
