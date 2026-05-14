import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import type Redis from 'ioredis';

@Injectable()
export class AppService {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.redis = this.redisService.getOrThrow();
  }

  getHello(): string {
    return 'Hello World!';
  }

  getTestRedis() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.redis.set('test-key', 'test-value', 'EX', 100);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.redis.get('test-key');
  }
}
