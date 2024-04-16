import { PartialType } from '@nestjs/mapped-types';
import { CreateMyPlantDto } from './create-my-plant.dto';

export class UpdateMyPlantDto extends PartialType(CreateMyPlantDto) {}
