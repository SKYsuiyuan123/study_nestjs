import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { EnvModule } from './env.module.js';
import { OrmModule } from './orm.module.js';
import { LogModule } from './log.module.js';
import { RedisModule } from './redis.module.js';
import { CacheConfigModule } from './cacheConfig.module.js';
import { MailModule } from './mail.module.js';
import { ServiceModule } from './service.module.js';

import { BusinessException } from '../common/exceptions/business.exception.js';
import { AllExceptionsFilter } from '../common/filters/all-exception.filter.js';
import { ZodExceptionFilter } from '../common/filters/zod-exception.filter.js';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RequestMiddleware } from '../common/request/request.middleware.js';

@Global()
@Module({
  imports: [
    EnvModule,
    OrmModule,
    LogModule,
    RedisModule,
    CacheConfigModule,
    MailModule,
    ServiceModule,
  ],
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
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 使用 NestJS 的中间件功能来注册中间件，例如：使用 request.middleware.ts 中间件来记录请求体
    consumer
      .apply(RequestMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        'api-docs/{*splat}',
      ) // 排除健康检查和 Swagger 文档路由，不应用中间件
      .forRoutes('{*splat}'); // 应用中间件到所有路由
  }
}
