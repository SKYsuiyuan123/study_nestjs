import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    // Exclude the health check endpoint from the global prefix
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 启动是在 3002 端口
  await app.listen(process.env.SERVER_PORT ?? 3000);
}

await bootstrap();
