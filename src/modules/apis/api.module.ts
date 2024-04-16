import { Module } from '@nestjs/common';
import { trefleController } from './trefle/trefleController';
import { PerenualController } from './perenual/perenual.controller';
import { PerenualService } from './perenual/perenual.service';
import { PerenualPlants } from './perenual/entities/perenual-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PerenualPlants])],
  controllers: [trefleController, PerenualController],
  providers: [PerenualService, PerenualController],
})
export class ApiModule {}
