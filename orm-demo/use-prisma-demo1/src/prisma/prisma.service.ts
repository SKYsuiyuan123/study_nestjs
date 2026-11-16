import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      user: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect(); // 启动时连接，配置错误立即暴漏。
  }

  async onModuleDestroy() {
    await this.$disconnect(); // 关闭时断开连接，避免连接泄漏。
  }
}
