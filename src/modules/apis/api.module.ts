import { Module } from '@nestjs/common';
import { trefleController } from './trefle/trefleController';

@Module({
  imports: [],
  controllers: [trefleController],
  providers: [],
})
export class ApiModule {}
