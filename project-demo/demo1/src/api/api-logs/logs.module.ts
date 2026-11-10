import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogsService } from './logs.service.js';
import { LogsController } from './logs.controller.js';

import { Logs } from './entities/logs.entity.js';
import { User } from '../user/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Logs, User])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
