import { IsInt, IsPositive } from 'class-validator';
import { GeneralDto } from 'src/common/interfaces/generalDto';

export class CreateMyPlantDto extends GeneralDto {
  @IsInt()
  @IsPositive()
  plantId: number;
}
