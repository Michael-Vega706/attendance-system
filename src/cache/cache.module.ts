import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;
        const secondary = createKeyv(redisUrl);
        return new Cacheable({ secondary, ttl: 14400000 });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
