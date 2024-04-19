import { Exclude } from 'class-transformer';
import { IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export abstract class GeneralDto {
  @IsOptional()
  @IsUUID('4')
  id: string;

  @Exclude()
  updatedAt?: Date;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;

  @Exclude()
  updatedBy?: string;

  @Exclude()
  deletedBy?: string;
}
