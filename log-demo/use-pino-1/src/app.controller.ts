import { Controller, Get, Logger } from '@nestjs/common';

import { AppService } from './app.service.js';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  // 由于我们在 main.ts 中已经挂载了 Pino 日志系统，所以这里的 Logger 会被自动替换为 Pino 的实现。
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly pinoLogger: PinoLogger,
  ) {
    // 设置当前类的上下文 (日志里会显示 [AppController] 前缀)
    this.pinoLogger.setContext(AppController.name);
  }

  @Get()
  getHello(): string {
    // 注意：不要把 PinoLogger 和 console.log 混用

    // console.log() 是 Node.js 原生打印，Pino 无法拦截。它不会输出 JSON，也不会带任何上下文，在生产环境极其难以排查。
    // 只要在 Nest 的代码里，坚决使用 PinoLogger 或 Nest 的 Logger。

    this.logger.log('getHello called');

    return this.appService.getHello();
  }

  @Get('health2')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
