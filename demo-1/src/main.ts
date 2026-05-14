import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

import { ConfigEnum } from './common/enum/config.enum';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const cors = configService.get<string>(ConfigEnum.CORS, 'false');
  const apiPrefix = configService.get<string>(ConfigEnum.API_PREFIX, '/api');
  const apiVersion = configService.get<string>(ConfigEnum.API_VERSION, '1');
  const port = configService.get<string>(ConfigEnum.SERVER_PORT) ?? 3000;

  // prefix: /api/v1
  app.setGlobalPrefix(apiPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [apiVersion],
  });

  if (cors === 'true') {
    app.enableCors();
  }

  await app.listen(port);
}

bootstrap();
