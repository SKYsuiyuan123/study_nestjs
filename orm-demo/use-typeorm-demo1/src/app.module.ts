import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as z from 'zod';

import { ConfigEnum } from './common/enum/config.enum.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { UserModule } from './user/user.module.js';
import { LogsModule } from './logs/logs.module.js';
import { RolesModule } from './roles/roles.module.js';

import { User } from './user/entities/user.entity.js';
import { Profile } from './user/entities/profile.entity.js';
import { Roles } from './roles/entities/roles.entity.js';
import { Logs } from './logs/entities/logs.entity.js';

// 可以借助 cross-env NODE_ENV 来设置 读取不同的环境变量文件
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    // envFilePath 指定 .env 文件后，@nestjs/config 会读取并解析这些文件，将键值对合并到 process.env 中。
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'], // 优先读取 .env.development 或 .env.production 等文件，如果没有则读取 .env 文件。注意：前边的同名环境变量 会覆盖后边的。
      validationSchema: z.object({
        NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
        [ConfigEnum.SERVER_PORT]: z.coerce.number().default(3000),
        [ConfigEnum.BASE_URL]: z.string().default('http://localhost:3000'),
        [ConfigEnum.DB_HOST]: z.string().default('localhost'),
        [ConfigEnum.DB_PORT]: z.coerce.number().default(3306),
        [ConfigEnum.DB_USERNAME]: z.string().default('root'),
        [ConfigEnum.DB_PASSWORD]: z.string().default('123456'),
        [ConfigEnum.DB_DATABASE]: z.string().default('test'),
      }),
    }),

    // 使用 forRootAsync 方法来异步配置 TypeORM,因为我们需要从 ConfigService 中获取数据库配置。
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(ConfigEnum.DB_HOST),
        port: configService.get<number>(ConfigEnum.DB_PORT),
        username: configService.get<string>(ConfigEnum.DB_USERNAME),
        password: configService.get<string>(ConfigEnum.DB_PASSWORD),
        database: configService.get<string>(ConfigEnum.DB_DATABASE),
        entities: [User, Profile, Logs, Roles], // 指定实体类
        synchronize: true, // 在开发环境中可以设置为 true，生产环境中建议设置为 false
        // logging: ['error', 'warn', 'info'], // 日志级别，可根据需要调整
        logging: true, // 所有的 SQL 语句都会打印
      }),
    }),

    UserModule,
    LogsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
