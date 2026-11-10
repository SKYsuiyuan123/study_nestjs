import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { EnvModule } from './env.module.js';
import { OrmModule } from './orm.module.js';
import { LogModule } from './log.module.js';

import { ZodExceptionFilter } from '../common/filters/zod-exception.filter.js';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor.js';

@Global()
@Module({
  imports: [EnvModule, OrmModule, LogModule],
  providers: [
    // 1. 注册全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: ZodExceptionFilter,
    },

    // 2. 注册全局验证管道
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },

    // 3. 注册全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class CoreModule {}
