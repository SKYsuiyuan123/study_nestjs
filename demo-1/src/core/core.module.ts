import { Global, Module } from '@nestjs/common';

import { DBConfigModule } from './db-config.module';
import { SystemConfigModule } from './system-config.module';
import { LogModule } from './log-config.module';
import { RedisConfigModule } from './redis-config.module';

@Global()
@Module({
  imports: [SystemConfigModule, DBConfigModule, RedisConfigModule, LogModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
