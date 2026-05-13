import { Global, Module } from '@nestjs/common';

import { DBConfigModule } from './db-config.module';
import { SystemConfigModule } from './system-config.module';
import { LogModule } from './log-config.module';

@Global()
@Module({
  imports: [SystemConfigModule, DBConfigModule, LogModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
