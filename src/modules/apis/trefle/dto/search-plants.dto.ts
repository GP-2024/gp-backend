import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

class FiltersPlants {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  common_name?: string;
}

export class SearchPlantsDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  filter?: FiltersPlants;
}
