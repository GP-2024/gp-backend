import { Module } from '@nestjs/common';
import { trefleController } from './trefle/trefleController';
import { PerenualController } from './perenual/perenual/perenual.controller';

@Module({
  imports: [],
  controllers: [trefleController, PerenualController],
  providers: [],
})
export class ApiModule {}
