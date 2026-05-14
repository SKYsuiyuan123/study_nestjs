import { Controller, Get, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum } from './common/enum/config.enum';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log('DB_NAME', this.configService.get(ConfigEnum.DB_NAME));
    console.log('DB_HOST', this.configService.get(ConfigEnum.DB_HOST));
    console.log('DB_PORT', this.configService.get(ConfigEnum.DB_PORT));
    console.log('DB_TYPE', this.configService.get(ConfigEnum.DB_TYPE));

    return this.appService.getHello();
  }

  @Get('/test-hello')
  @Version('2')
  getV2Hello(): string {
    return 'Hello test V2......';
  }
}
