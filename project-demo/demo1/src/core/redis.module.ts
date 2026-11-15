import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

import { ConfigEnum } from '../common/enum/config.enum.js';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 从 zod 校验过的配置里读取连接信息
        const host = configService.get<string>(
          ConfigEnum.REDIS_HOST,
          'localhost',
        );
        const port = configService.get<number>(ConfigEnum.REDIS_PORT, 6379);
        const password = configService.get<string>(
          ConfigEnum.REDIS_PASSWORD,
          '',
        );

        const client = new Redis({
          host,
          port,
          password,
          retryStrategy: (times: number) => Math.min(times * 50, 2000), // 重试策略，最大延迟 2 秒
        });

        client.on('connect', () => {
          console.log(`Redis connected to ${host}:${port}`);
        });
        client.on('error', (err: any) => {
          console.error('Redis connection error:', err);
        });

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  // 应用关闭时 (配合 main.ts 里的) enableShutdownHooks(), 优雅断开连接。
  async onApplicationShutdown(signal?: string) {
    await this.redisClient.quit();
    console.log('Redis connection closed gracefully.');
  }
}
