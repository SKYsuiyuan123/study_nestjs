import { Injectable, NestMiddleware } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly pinoLogger: PinoLogger) {
    this.pinoLogger.setContext(RequestMiddleware.name);
  }

  use(req: any, res: any, next: () => void) {
    // 1. 深拷贝或只提取需要的字段，千万别直接打 req
    const { method, originalUrl, body } = req;

    // 2. 过滤敏感信息
    const safeBody = { ...body };
    if (safeBody.password) safeBody.password = '******';
    if (safeBody.confirmPassword) safeBody.confirmPassword = '******';

    // 3. 打印日志（只在有 body 的时候打，避免 GET 请求刷屏）
    if (Object.keys(safeBody).length > 0) {
      this.pinoLogger.info(
        { method, url: originalUrl, body: safeBody },
        'Incoming Request Body',
      );
    }

    next();
  }
}
