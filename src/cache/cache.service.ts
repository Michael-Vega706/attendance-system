import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number | string) {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.delete(key);
  }

  async clear() {
    await this.cache.clear();
  }
}
