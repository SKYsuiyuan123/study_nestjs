import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';

import { ConfigEnum } from '../common/enum/config.enum.js';

// 对于缓存的数据，统一走 CacheManager 读；如果你要用原生 ioredis 读，建议做一下数据格式兼容，或者尽量把“缓存”和“原生 Redis 操作”的场景隔离开。

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true, // 全局可用，业务模块无需再导入。
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>(
          ConfigEnum.REDIS_HOST,
          'localhost',
        );
        const port = configService.get<number>(ConfigEnum.REDIS_PORT, 6379);
        const password = configService.get<string>(
          ConfigEnum.REDIS_PASSWORD,
          '',
        );

        // 拼接 Redis 连接 URL，带密码 (redis://:password@host:port)
        const redisUrl = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        console.log(`Redis URL: ${redisUrl}`); // 打印 Redis 连接 URL，方便调试

        return {
          stores: [
            // 使用 Keyv 作为缓存存储，支持多种后端，包括 Redis。
            // 使用 Keyv 的好处是可以在不同的存储后端之间切换，而无需修改业务代码。
            // 使用 Keyv 时，缓存的 key 会被序列化为字符串，value 会被序列化为 JSON。
            // 使用 Keyv 包装 Redis 客户端时，Keyv 会自动处理连接、序列化和反序列化。
            // 使用 Keyv 包装 KeyvRedis。
            new Keyv({
              store: new KeyvRedis(redisUrl),
              // namespace: 'cache', // 可选，设置命名空间，避免 key 冲突。
              namespace: 'nest-project-demo1', // 👈 这样 key 就会变成 nest-project-demo1::user:14
            }),
          ],
          ttl: 60 * 1000, // 默认 TTL 60秒（注意：单位是毫秒）
        };
      },
    }),
  ],
})
export class CacheConfigModule {}
