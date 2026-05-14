import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { ConfigEnum } from 'src/common/enum/config.enum';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>(ConfigEnum.REDIS_HOST),
          port: configService.get<number>(ConfigEnum.REDIS_PORT),
          password: configService.get<string>(ConfigEnum.REDIS_PASSWORD),

          onClientCreated(client) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            client.on('error', (err) => {
              console.log('Redis client error: ', err);
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            client.on('ready', () => {
              console.log('Redis client success...');
            });
          },
        },
      }),
    }),
  ],
})
export class RedisConfigModule {}
