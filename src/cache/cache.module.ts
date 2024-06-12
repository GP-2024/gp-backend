import { Module } from '@nestjs/common';
import { CacheInvalidationService } from './cacheInvalidation.service';

@Module({
  providers: [CacheInvalidationService],
  exports: [CacheInvalidationService],
})
export class CacheModule {}
