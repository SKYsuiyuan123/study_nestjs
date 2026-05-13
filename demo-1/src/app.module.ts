import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoreModule } from './core/core.module';
import { ApiRouterModule } from './api/api-router.module';

@Module({
  imports: [ApiRouterModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
