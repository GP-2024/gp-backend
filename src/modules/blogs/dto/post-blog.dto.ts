import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Max, MaxLength, MinLength } from 'class-validator';

export class postDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  content: string;
}
