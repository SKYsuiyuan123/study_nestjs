import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as z from 'zod';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { ConfigEnum } from './common/enum/config.enum.js';

// 可以借助 cross-env NODE_ENV 来设置 读取不同的环境变量文件
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'], // 优先读取 .env.development 或 .env.production 等文件，如果没有则读取 .env 文件。注意：前边的同名环境变量 会覆盖后边的。
      load: [
        () => ({
          [ConfigEnum.SERVER_PORT]: process.env[ConfigEnum.SERVER_PORT],
        }),
      ],
      validationSchema: z.object({
        NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
        [ConfigEnum.SERVER_PORT]: z.coerce.number().default(3000),
        [ConfigEnum.BASE_URL]: z.string().default('http://localhost:3000'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
