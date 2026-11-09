import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { CoreModule } from './core/core.module.js';
import { ApiModule } from './api/api.module.js';

@Module({
  imports: [CoreModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
