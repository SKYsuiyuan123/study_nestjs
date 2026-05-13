import { Global, Module } from '@nestjs/common';

import { SystemConfigModule } from './system-config.module';

@Global()
@Module({
  imports: [SystemConfigModule],
  providers: [],
  exports: [],
})
export class CoreModule {}
