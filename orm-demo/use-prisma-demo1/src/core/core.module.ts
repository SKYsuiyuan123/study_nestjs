import { Module } from '@nestjs/common';

import { EnvModule } from './env.module.js';
import { LogModule } from './log.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ApiModule } from '../api/api.module.js';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [ApiModule, EnvModule, LogModule, PrismaModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class CoreModule {}
