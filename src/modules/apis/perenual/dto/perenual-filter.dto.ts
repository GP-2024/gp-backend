import { IsOptional } from 'class-validator';

export class PerenualFilterDto {
  @IsOptional()
  q: string;
}
