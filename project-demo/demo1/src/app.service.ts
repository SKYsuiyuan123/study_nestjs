import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  logMemory() {
    const memoryUsage = process.memoryUsage();

    return {
      res: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100 + ' MB', // 常驻内存集大小
      heapTotal:
        Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100 + ' MB', // V8 堆的总大小
      heapUsed:
        Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100 + ' MB', // V8 堆中已使用的内存大小
      external:
        Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100 + ' MB', // C++ 对象绑定到 JavaScript 对象的内存使用量
    };

    // heapUsed：JS 对象实际占用的堆内存。这个值持续上涨，基本就是内存泄漏（比如无界缓存、事件监听器没移除、闭包持有大对象）。
    // heapTotal：V8 预留的堆空间，通常比 heapUsed 大，会跳跃式变化。
    // rss：整个进程占用的物理内存，包括堆、栈、代码、Buffer、原生模块。
    // external / arrayBuffers：C++ 对象和 Buffer 相关。

    // 在 NestJS 场景下最有用的判据是：看 heapUsed 和 rss 的关系。
    // 如果 heapUsed 单独持续上涨，说明你在 JS 层积累了对象（比如某个 Service 里的 Map 只增不减）。
    // 如果 rss 在涨但 heapUsed 平稳，泄漏不在 V8 堆里，可能在 Buffer、原生模块或数据库连接池。

    // Node 的堆内存的占用率：heapUsed / heapTotal * 100%，如果超过 70% 就要注意了。
    // 内存系统的垃圾回收机制是自动的，Node 会在堆内存占用率超过 70% 时触发垃圾回收，但这并不意味着内存泄漏不会发生。
  }
}
