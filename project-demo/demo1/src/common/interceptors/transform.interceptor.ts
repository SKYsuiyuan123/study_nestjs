import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ConstStr } from '../enum/constant.enum.js';

// 定义统一的返回结构
export interface IResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  IResponse<T>
> {
  // 拦截器的 constructor 中注入 Reflector，用于获取元数据。
  constructor(private reflect: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    // 个别接口不需要格式化返回
    const noWrap = this.reflect.getAllAndOverride<boolean>(ConstStr.noWrap, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (noWrap) {
      return next.handle(); // 直接返回，不包装。
    }

    // 获取当前请求的上下文，拿到 Response 对象，以便获取真实的 HTTP 状态码。
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          status: response.statusCode, // 成功时通常是 200 或 201
          message: 'success', // 可以根据需要自定义消息，或者从 controller 返回的结果中获取
          data, // 真正的业务数据
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
