import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../generated/prisma/client.js';
import { ConfigEnum } from '../common/enum/config.enum.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get(ConfigEnum.DB_HOST),
      port: configService.get(ConfigEnum.DB_PORT),
      user: configService.get(ConfigEnum.DB_USERNAME),
      password: configService.get(ConfigEnum.DB_PASSWORD),
      database: configService.get(ConfigEnum.DB_DATABASE),
      connectionLimit: configService.get(ConfigEnum.DB_CONNECTION_LIMIT) || 10, // 默认连接池大小为 10
      connectTimeout: 1000 * 3, // 连接超时，单位毫秒, 默认值为 1000 毫秒.
      acquireTimeout: 1000 * 30, // 获取连接超时，单位毫秒, 默认值为 10 秒.（当池子满了，新请求等待空闲连接的最长时间，超时会报错。)
      idleTimeout: 1000 * 1800, // 空闲连接超时，单位秒, 默认值为 30分钟.（当连接空闲时间超过该值时，连接会被释放掉。连接空闲多久后被释放，一般不用动，除非你有特殊的长连接管理需求。)
    });

    // 如果在本地开发时遇到 “Too many connections” 错误，优先检查 connectionLimit 是否设得过大，或者是否有未关闭的 Prisma Client 实例在反复创建连接。

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect(); // 启动时连接，配置错误立即暴漏。
  }

  async onModuleDestroy() {
    await this.$disconnect(); // 关闭时断开连接，避免连接泄漏。
  }
}
