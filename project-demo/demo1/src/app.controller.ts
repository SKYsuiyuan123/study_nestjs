import { Controller, Get, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from './core/redis.module.js';

import { NoWrap } from './common/decorators/noWrap.decorator.js';
import { Public } from './common/decorators/public.decorator.js';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public() // @Public 装饰器用于标记该接口为公开访问，不需要身份验证。
  @Get('health')
  @NoWrap() // @NoWrap 装饰器用于告诉 NestJS 不要对该接口的响应进行包装，直接返回原始数据。
  healthCheck(): {
    status: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public() // @Public 装饰器用于标记该接口为公开访问，不需要身份验证。
  @Get('redis-cache')
  async getTestCache() {
    // ioredis 客户端已经在 RedisModule 中全局注册，可以通过注入 REDIS_CLIENT 来使用。
    const cached = await this.redisClient.get('test_key');

    if (cached) {
      return { catchVale: cached };
    }

    const value = 'Hello from Redis!';
    await this.redisClient.set('test_key', value, 'EX', 60); // 设置缓存，过期时间为 60 秒

    return { catchVale: value };
  }
}
