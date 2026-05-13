import { Global, Module } from '@nestjs/common';

import { DBConfigModule } from './db-config.module';
import { SystemConfigModule } from './system-config.module';

@Global()
@Module({
  imports: [SystemConfigModule, DBConfigModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
