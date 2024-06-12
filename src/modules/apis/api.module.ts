import { Module, forwardRef } from '@nestjs/common';
import { trefleController } from './trefle/trefleController';
import { PerenualController } from './perenual/perenual.controller';
import { PerenualService } from './perenual/perenual.service';
import { PerenualPlants } from './perenual/entities/perenual-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { MyPlantsService } from '../my-plants/my-plants.service';
import { MyPlantsModule } from '../my-plants/my-plants.module';
import { MyPlants } from '../my-plants/entities/my-plant.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [forwardRef(() => MyPlantsModule), TypeOrmModule.forFeature([PerenualPlants, MyPlants]), CacheModule],
  controllers: [trefleController, PerenualController, ApiController],
  providers: [PerenualService, ApiService, MyPlantsService],
  exports: [ApiService],
})
export class ApiModule {}
