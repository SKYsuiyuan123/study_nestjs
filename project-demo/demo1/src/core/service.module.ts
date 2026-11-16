import { Global, Module } from '@nestjs/common';

import { NotificationService } from '../common/services/notification.service.js';

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class ServiceModule {}
