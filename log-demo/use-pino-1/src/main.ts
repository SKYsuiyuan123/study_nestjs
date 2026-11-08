import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module.js';

async function bootstrap() {

  // 1. 启动时挂载 bufferLogs: true 开启缓冲
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log'],

    // 当你设置 bufferLogs: true 后，NestJS 会这样做：
    // 1. 暂存：在应用启动的整个过程中，所有产生的日志都会被悄悄存入内存中的缓冲区，不打印。
    // 2. 交接：当你执行 app.useLogger(app.get(Logger)) 时，NestJS 知道了你最终要用的日志系统是 Pino。
    // 3. 冲洗（Flush）：NestJS 会把刚才暂存在内存里的日志，全部交给你配置的 Pino 重新打印出来。
    bufferLogs: true,
  });

  // 2. 将 NestJS 的原生日志系统重定向到 Pino
  app.useLogger(app.get(Logger));

  // 3. 如果你需要全局验证（比如 class-validator），在这里启用（可选）
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // 4. 设置全局前缀（结合你之前问过的 /api）
  // app.setGlobalPrefix('api');

  // 5. 优雅退出：监听系统信号（如 Docker 里的 SIGTERM）
  // 确保应用关闭时，Pino 的日志缓冲能刷新完毕，TypeORM 连接能正常关闭
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
