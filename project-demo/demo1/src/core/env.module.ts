import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as z from 'zod';

import { ConfigEnum } from '../common/enum/config.enum.js';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'],
      validationSchema: z.object({
        NODE_ENV: z
          .enum(['development', 'production', 'test'])
          .default('development'),
        [ConfigEnum.SERVER_PORT]: z.coerce.number().default(3000),
        [ConfigEnum.DB_HOST]: z.string().default('localhost'),
        [ConfigEnum.DB_PORT]: z.coerce.number().default(3306),
        [ConfigEnum.DB_USERNAME]: z.string().default('root'),
        [ConfigEnum.DB_PASSWORD]: z.string().default('123456'),
        [ConfigEnum.DB_DATABASE]: z.string().default('test'),
      }),
    }),
  ],
})
export class EnvModule {}
