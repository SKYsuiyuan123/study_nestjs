import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { ConstantEnum } from '../enum/constant.enum.js';

@Injectable() // 使用了 @Injectable 装饰器，表示这个类可以被 NestJS 的依赖注入系统管理。
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflect: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 检查当前路由是否被标记为公开访问

    const isPublic = this.reflect.getAllAndOverride<boolean>(
      ConstantEnum.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    // 调用父类的 canActivate 方法来执行 JWT 验证逻辑，它内部会调用 Passport 的策略来验证请求中的 JWT token 是否有效。
    // 如果验证成功，返回 true，允许请求继续处理；如果验证失败，抛出 UnauthorizedException 异常，返回 401 状态码。
    // super.canActivate(context) 内部会自动访问 handleRequest 方法。
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('身份验证失败，请先登录。');
    }

    return user;
  }
}
