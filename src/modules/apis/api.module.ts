import { Module } from '@nestjs/common';
import { trefleController } from './trefle/trefleController';
import { PerenualController } from './perenual/perenual.controller';
import { PerenualService } from './perenual/perenual.service';
import { PerenualPlants } from './perenual/entities/perenual-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [TypeOrmModule.forFeature([PerenualPlants])],
  controllers: [trefleController, PerenualController, ApiController],
  providers: [PerenualService, ApiService],
})
export class ApiModule {}
