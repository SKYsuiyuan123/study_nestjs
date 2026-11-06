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
  } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      port: this.configService.get<number>(ConfigEnum.SERVER_PORT, 3000),
      baseUrl: this.configService.get<string>(
        ConfigEnum.BASE_URL,
        'http://localhost:3000',
      ),
    };
  }
}
