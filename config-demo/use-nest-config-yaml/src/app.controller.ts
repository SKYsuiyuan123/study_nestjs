import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum } from './common/enum/config.enum.js';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck(): {
    status: string;
    timestamp: string;
    port: number;
    baseUrl: string;
    db_host: string;
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      // 注意：这里返回的 this.configServer.get 是遵循 ConfigService.get 方法的查找顺序的 (详见 app.module.ts)，
      // 可能是 load 方法返回的配置对象，也可能是经过验证的环境变量，也可能是 process.env 中的变量。
      port: this.configService.get<number>(ConfigEnum.SERVER_PORT, 3000), // 服务是启动在 .env 的 3002 上，但是 这里 返回的是 yaml 配置的内容。
      baseUrl: this.configService.get<string>(
        ConfigEnum.BASE_URL,
        'http://localhost:3000',
      ),
      db_host: this.configService.get<string>(ConfigEnum.DB_HOST, 'localhost'),
    };
  }
}
