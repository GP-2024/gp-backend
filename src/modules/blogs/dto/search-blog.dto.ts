import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class SearchDTO {
  @IsString()
  @IsOptional()
  searchKey: string;
}
