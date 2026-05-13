import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum } from './common/enum/config.enum';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<string>(ConfigEnum.SERVER_PORT) ?? 3000;

  await app.listen(port);
}

bootstrap();
