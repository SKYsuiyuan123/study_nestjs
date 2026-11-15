import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

// 注意：这种方案适合 Controller 本身没有参数，纯靠上下文区分的场景。如果 URL 已经带了参数（如 /user/1），其实默认的 trackBy 就能区分了，不需要这套。

// 最稳妥的 (最佳实践) 是：在 Service 里显式控制。Service 层手动缓存（强烈推荐）
// findUserById 里的 get -> 查库 -> set 逻辑，其实才是做业务缓存最常用的方式。

// 为什么不推荐用 CacheInterceptor 来做用户级别的缓存？
// 1. 颗粒度不够：拦截器拦截的是整个 HTTP 响应，你很难控制“如果用户更新了信息，立马清除这个缓存”。
// 2. 容易出 Bug：一旦你忘了在 Controller 上重写拦截器，或者某个接口配置错了，立马就是极其严重的越权漏洞。
// 3. 无法区分公共数据和私有数据：像“字典表”、“全国城市列表”这种适合全局缓存；而“我的个人资料”必须按人缓存。

// 总结：
// 如果是公共数据（比如全站公告、首页配置、不需要登录的列表），直接用 @UseInterceptors(CacheInterceptor) 配合 @CacheTTL，极度省事。
// 如果是用户私有数据（比如用户信息、个人订单），放弃拦截器，老老实实在 Service 里用 cacheKey = \user:xxx:${userId}`` 手动管理缓存。这更安全，也更好维护。

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  // 重写 trackBy 方法，指定缓存的 key
  protected trackBy(
    context: ExecutionContext,
  ): Promise<string | undefined | null> | string | undefined | null {
    const request = context.switchToHttp().getRequest();

    // 获取请求的 URL 作为基础 key
    let key = request.url;

    // 如果当前请求里有登陆用户 (userId)，则将 userId 作为缓存 key 的一部分
    if (request.user && request.user.userId) {
      key = `${key}-user-${request.user.userId}`;
    }

    return key;
  }
}
