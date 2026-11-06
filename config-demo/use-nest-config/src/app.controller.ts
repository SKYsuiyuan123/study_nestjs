import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  healthCheck(): { status: string; timestamp: string; port: number } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      port: this.configService.get<number>('SERVER_PORT', 3000),
    };
  }
}
