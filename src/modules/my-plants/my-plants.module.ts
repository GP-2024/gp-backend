import { Module, forwardRef } from '@nestjs/common';
import { MyPlantsService } from './my-plants.service';
import { MyPlantsController } from './my-plants.controller';
import { ApiModule } from '../apis/api.module';
import { PerenualService } from '../apis/perenual/perenual.service';
import { PerenualPlants } from '../apis/perenual/entities/perenual-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyPlants } from './entities/my-plant.entity';
import { CacheInvalidationService } from 'src/cache/cacheInvalidation.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [forwardRef(() => ApiModule), TypeOrmModule.forFeature([PerenualPlants, MyPlants]), CacheModule],
  controllers: [MyPlantsController],
  providers: [MyPlantsService, PerenualService],
})
export class MyPlantsModule {}
