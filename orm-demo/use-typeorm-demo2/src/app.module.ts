import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as z from 'zod';

import { ConfigEnum, ConstantsEnum } from './common/enum/config.enum.js';
import { User } from './user/entities/user.entity.js';
import { Profile } from './user/entities/profile.entity.js';

import { UserModule } from './user/user.module.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

// 实现 TypeORM 多数据库操作，主要有三种方法。最常用且官方推荐的是“多数据源（Multiple Data Sources）”，也就是在应用里创建多个独立的连接，并给它们起不同的名字来区分。

// 方案一：多数据源（Multiple Data Sources）—— 最推荐
// 方法二：单数据源内跨库（通过 @Entity({ database: 'xxx' })）
// 方法三：动态创建连接（针对多租户）
//    这是一种更特殊的场景。如果你的每个租户都有一个独立的数据库，且数据库数量不固定，可以在请求到来时，根据租户信息动态 new DataSource() 并初始化，用完再销毁或复用。
//    适用场景：SaaS 多租户，每个租户一个独立数据库。
//    缺点：如果每个请求都新建连接，性能开销大，且容易耗尽数据库连接数。需要自己做连接池管理或缓存已初始化的 DataSource 实例。

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
        [ConfigEnum.DB1_HOST]: z.string().default('localhost'),
        [ConfigEnum.DB1_PORT]: z.coerce.number().default(3306),
        [ConfigEnum.DB1_USERNAME]: z.string().default('root'),
        [ConfigEnum.DB1_PASSWORD]: z.string().default('123456'),
        [ConfigEnum.DB1_DATABASE]: z.string().default('test'),
      }),
    }),

    // 使用 forRootAsync 方法来异步配置 TypeORM,因为我们需要从 ConfigService 中获取数据库配置。
    TypeOrmModule.forRootAsync({
      // 这里默认的 name 是 default，如果不指定 name，则会覆盖默认连接。
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(ConfigEnum.DB1_HOST),
        port: configService.get<number>(ConfigEnum.DB1_PORT),
        username: configService.get<string>(ConfigEnum.DB1_USERNAME),
        password: configService.get<string>(ConfigEnum.DB1_PASSWORD),
        database: configService.get<string>(ConfigEnum.DB1_DATABASE),
        entities: [User, Profile], // 指定实体类
        synchronize: true, // 在开发环境中可以设置为 true，生产环境中建议设置为 false
        // logging: ['error', 'warn', 'info'], // 日志级别，可根据需要调整
        logging: true, // 所有的 SQL 语句都会打印
      }),
    }),

    // 配置第二个数据库连接
    TypeOrmModule.forRootAsync({
      name: ConstantsEnum.DB2_CONNECTION_NAME, // 给第二个连接起一个名字，默认是 default，如果不指定 name，则会覆盖默认连接
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(ConfigEnum.DB2_HOST),
        port: configService.get<number>(ConfigEnum.DB2_PORT),
        username: configService.get<string>(ConfigEnum.DB2_USERNAME),
        password: configService.get<string>(ConfigEnum.DB2_PASSWORD),
        database: configService.get<string>(ConfigEnum.DB2_DATABASE),
        entities: [User, Profile], // 指定实体类
        synchronize: true, // 在开发环境中可以设置为 true，生产环境中建议设置为 false
        logging: true, // 所有的 SQL 语句都会打印
      }),
    }),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
