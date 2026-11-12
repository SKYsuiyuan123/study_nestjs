import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { EnvModule } from './env.module.js';
import { OrmModule } from './orm.module.js';
import { LogModule } from './log.module.js';

import { BusinessException } from '../common/exceptions/business.exception.js';
import { AllExceptionsFilter } from '../common/filters/all-exception.filter.js';
import { ZodExceptionFilter } from '../common/filters/zod-exception.filter.js';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

@Global()
@Module({
  imports: [EnvModule, OrmModule, LogModule],
  providers: [
    // 1. 先捕获业务异常
    {
      provide: APP_FILTER,
      useClass: BusinessException,
    },
    // 2. 兜底所有其它异常
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // 3. 捕获 Zod 校验异常
    {
      provide: APP_FILTER,
      useClass: ZodExceptionFilter,
    },

    // 4. 注册全局验证管道
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },

    // 5. 注册全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    // 6. 注册全局 Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 全局注册 JwtAuthGuard，所有路由默认需要身份验证，除非使用 @Public() 装饰器标记为公开访问。
    },
  ],
})
export class CoreModule {}
