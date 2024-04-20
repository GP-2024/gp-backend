import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class postDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
