import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';

type CustomResponseType = {
  statusCode: number;
  message: string | string[];
  errors?: string[]; // 可选的错误信息数组
};

@Catch(BadRequestException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 获取原始异常响应体
    const originalResponse = exception.getResponse() as any;
    const status = exception.getStatus();

    let customResponse: CustomResponseType = {
      statusCode: status,
      message: originalResponse || '请求参数错误',
    };

    // 判断是否是 Zod 抛出的标准校验错误
    // (nest-zod 默认会返回一个包含 errors 数组的对象)
    if (originalResponse.errors && Array.isArray(originalResponse.errors)) {
      // 只提起 errors 里的 message 字段，组成一个字符串数组。
      const messages = originalResponse.errors.map((err: any) => err.message);

      customResponse = {
        statusCode: status,
        message: '请求参数错误', // 可以自定义一个统一的错误提示
        errors: messages, // 将错误信息数组添加到响应中
      };
    }

    response.status(status).json(customResponse);
  }
}
