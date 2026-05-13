import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEnum } from 'src/common/enum/config.enum';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(ConfigEnum.DB_HOST),
        port: configService.get(ConfigEnum.DB_PORT),
        database: configService.get(ConfigEnum.DB_NAME),
        username: configService.get(ConfigEnum.DB_USER_NAME),
        password: configService.get(ConfigEnum.DB_PASSWORD),
        synchronize: configService.get(ConfigEnum.DB_SYNC),
        logging: ['log'],
        // logging: false,
        entities: [],
      }),
    }),
  ],
})
export class DBConfigModule {}
