import { Module } from '@nestjs/common';
import { trefleController } from './trefleController';

@Module({
  imports: [],
  controllers: [trefleController],
  providers: [],
})
export class ApiModule {}
