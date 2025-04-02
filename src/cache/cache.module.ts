import { createKeyv } from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://localhost:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: ['CACHE_INSTANCE', CacheService],
})
export class CacheModule {}
