import { Module } from '@nestjs/common';
import { MyPlantsService } from './my-plants.service';
import { MyPlantsController } from './my-plants.controller';
import { ApiModule } from '../apis/api.module';
import { PerenualService } from '../apis/perenual/perenual.service';
import { PerenualPlants } from '../apis/perenual/entities/perenual-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPlants } from './entities/my-plant.entity';

@Module({
  imports: [ApiModule, TypeOrmModule.forFeature([PerenualPlants, MyPlants])],
  controllers: [MyPlantsController],
  providers: [MyPlantsService, PerenualService],
})
export class MyPlantsModule {}
