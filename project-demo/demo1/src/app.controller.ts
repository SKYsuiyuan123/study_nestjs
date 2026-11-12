import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service.js';
import { NoWrap } from './common/decorators/noWrap.decorator.js';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public() // @Public 装饰器用于标记该接口为公开访问，不需要身份验证。
  @Get('health')
  @NoWrap() // @NoWrap 装饰器用于告诉 NestJS 不要对该接口的响应进行包装，直接返回原始数据。
  healthCheck(): {
    status: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
