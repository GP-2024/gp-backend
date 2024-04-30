import { IsEmail, IsNotEmpty, IsString, ValidateIf } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class SignInDto {
  @IsOptional()
  username: string | undefined;

  @IsOptional()
  email: string | undefined;

  @IsNotEmpty()
  @IsString()
  password: string;
}
