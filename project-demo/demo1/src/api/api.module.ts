import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module.js';
import { LogsModule } from './api-logs/logs.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RolesModule } from './roles/roles.module.js';
import { MenusModule } from './menus/menus.module.js';

@Module({
  imports: [UserModule, LogsModule, AuthModule, RolesModule, MenusModule],
})
export class ApiModule {}
