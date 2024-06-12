import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async invalidateKeys(pattern: string) {
    const client = this.cacheManager.store;
    const keys = await client.keys();
    const keysToDelete = keys.filter((key) => key.startsWith(pattern));

    for (const key of keysToDelete) {
      await this.cacheManager.del(key);
    }
  }
}
