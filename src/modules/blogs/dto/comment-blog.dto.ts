import { IsNotEmpty, IsString, IsUUID } from '@nestjs/class-validator';

export class commentDTO {
  @IsNotEmpty()
  @IsString()
  content: string;
}
