import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly pinLogger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 5xx 错误必须记录日志，方便排查。
    if (status >= 500) {
      this.pinLogger.error({ exception }, '服务器内部错误');
    }

    response.status(status).json({
      status,
      message:
        status >= 500
          ? '服务器内部错误'
          : (exception as HttpException).message || '请求错误',
      data: null,
      timeStamp: new Date().toISOString(),
    });
  }
}
