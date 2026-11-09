import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from '../common/enum/config.enum.js';

import { User } from '../api/user/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>(ConfigEnum.DB_HOST),
        port: configService.get<number>(ConfigEnum.DB_PORT),
        username: configService.get<string>(ConfigEnum.DB_USERNAME),
        password: configService.get<string>(ConfigEnum.DB_PASSWORD),
        database: configService.get<string>(ConfigEnum.DB_DATABASE),
        entities: [User], // 指定实体类
        synchronize: true, // 在开发环境中可以设置为 true，生产环境中建议设置为 false
        // logging: ['error', 'warn', 'info'], // 日志级别，可根据需要调整
        logging: true, // 所有的 SQL 语句都会打印
      }),
    }),
  ],
})
export class OrmModule {}
