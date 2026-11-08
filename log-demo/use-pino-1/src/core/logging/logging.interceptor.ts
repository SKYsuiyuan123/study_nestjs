import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // 1. 只提取需要的核心信息，绝对不要把整个 req 扔进日志
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const now = Date.now();

    // 2. 结构化打印：传入一个对象 + 一条消息字符串
    this.logger.info(
      { method, url, ip, userAgent },
      `Incoming Request: ${method} ${url}`,
    );

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now; // ms
        this.logger.info({ method, url, delay }, 'Request completed 222');
      }),
    );
  }
}
