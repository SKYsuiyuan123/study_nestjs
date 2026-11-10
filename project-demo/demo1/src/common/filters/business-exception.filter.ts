import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { BusinessException } from '../exceptions/business.exception.js';

// 业务异常过滤器
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      status,
      message: exception.message, // 异常消息
      data: null, // 业务异常通常不返回数据
      timestamp: new Date().toISOString(), // 返回当前时间戳
    });
  }
}
