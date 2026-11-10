import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module.js';
import { LogsModule } from './api-logs/logs.module.js';

@Module({
  imports: [UserModule, LogsModule],
})
export class ApiModule {}
