import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';

export const createTestCache = () => {
  const redisUrl = process.env.TEST_REDIS_URL;
  const secondary = createKeyv(redisUrl);
  return new Cacheable({ secondary, ttl: 14400000 });
}; 