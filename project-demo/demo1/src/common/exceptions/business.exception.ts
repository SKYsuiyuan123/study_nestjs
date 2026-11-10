import { HttpException, HttpStatus } from '@nestjs/common';

// 业务异常类
export class BusinessException extends HttpException {
  public readonly code: string; // 业务异常码,前端据此做判断。

  constructor(
    message: string,
    code = 'BUSINESS_ERROR',
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, status);
    this.code = code;
  }
}
