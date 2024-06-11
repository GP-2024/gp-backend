import { IsOptional } from 'class-validator';

export class MyPlantsFilterDto {
  @IsOptional()
  q: string;
}
