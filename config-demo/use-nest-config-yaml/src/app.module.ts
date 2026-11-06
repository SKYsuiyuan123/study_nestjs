import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as z from 'zod';

import { ConfigEnum } from './common/enum/config.enum.js';
import Configuration from './configuration.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// 可以借助 cross-env NODE_ENV 来设置 读取不同的环境变量文件
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    // envFilePath 指定 .env 文件后，@nestjs/config 会读取并解析这些文件，将键值对合并到 process.env 中。
    // 在默认情况下，系统自带的 process.env 变量优先级高于 .env 文件里的同名配置，.env 文件无法覆盖它。

    // load 方法的变量 不会覆盖 process.env 中的同名变量，除非你在 load 方法中手动读取 process.env 的值。
    // load 方法的变量 不会加载进 process.env 中，它们只会在 ConfigService.get 方法中返回。

    // ConfigService.get 方法的查找顺序：
    // 1. load 方法返回的配置对象
    // 2. 经过验证的环境变量（validationSchema）
    // 3. process.env（包含来自 .env 文件的变量）

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'],
      load: [Configuration],
      validationSchema: z.object({
        NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
        [ConfigEnum.SERVER_PORT]: z.coerce.number().default(3000),
        [ConfigEnum.BASE_URL]: z.string().default('http://localhost:3000'),
        [ConfigEnum.DB_HOST]: z.string().default('localhost'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
