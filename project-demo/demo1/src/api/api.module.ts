import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module.js';
import { LogsModule } from './api-logs/logs.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [UserModule, LogsModule, AuthModule],
})
export class ApiModule {}
