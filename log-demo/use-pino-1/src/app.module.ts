import path, { join } from 'path';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { LoggingInterceptor } from './core/logging/logging.interceptor.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // 自定义序列化（控制日志大小，避免打出一堆无用的 header）
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              // 过滤掉敏感 header（比如 authorization 和 cookie）
              headers: {
                'user-agent': req.headers['user-agent'],
              },
              id: req.id, // Pino 会自动生成一个唯一的请求 ID, 用于追踪请求链路。
              ip: req.ip,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },

        // 开发环境下，使用 prettyPrint 选项来美化日志输出，生产环境下建议关闭该选项以提高性能。

        // 生产环境（Docker 内）直接输出到 stdout
        // 不需要配置 transport，Pino 默认就会写到 process.stdout
        // transport:
        //   process.env.NODE_ENV !== 'production'
        //     ? {
        //         target: 'pino-pretty',
        //         options: {
        //           colorize: true,
        //           translateTime: 'SYS:standard',
        //           ignore: 'pid,hostname',
        //         },
        //       }
        //     : {
        //         // 1. 如果你的 NestJS 是用 Docker 部署的，千万不要把日志写进容器内部的本地文件。因为容器重启或销毁后，文件就没了。
        //         // 最佳实践：在 Docker 环境中，Pino 应该把日志直接输出到标准输出（stdout），也就是直接打印到控制台。
        //         // 然后由 Docker 的日志驱动（如 json-file、fluentd）或者 K8s 的日志收集组件（如 Filebeat、Fluent Bit）在宿主机层面把日志截获并转存。

        //         // 2. 虽然 Pino 是异步的，但当多个进程（如 PM2 集群模式）同时往同一个文件里写日志时，可能会发生文件锁定冲突或者日志交错。
        //         // 最佳实践：如果你使用 PM2 部署，最好让 PM2 负责输出，或者让 Pino 把日志输出到 stdout，然后用 PM2 的 pm2-logrotate 插件来管理日志文件。

        //         // 生产环境下设为 undefined，Pino 就会直接输出 JSON 到 stdout

        //         // 生产环境将日志输出为 JSON 格式，便于日志收集和分析，写入文件。
        //         target: 'pino-roll',
        //         options: {
        //           size: '10M',
        //           compress: true,
        //           // 日志文件存放目录，建议放在项目根目录下的 logs 文件夹
        //           file: join(process.cwd(), 'logs', 'app'),
        //           // 自动追加 .log 后缀
        //           extension: '.log',
        //           // 按天切割日志（也可以写数字表示按文件大小切割，如 '10m'）
        //           frequency: 'daily',
        //           // 如果日志目录不存在，自动创建
        //           mkdir: true,
        //           // 保留最近 7 天的日志（根据 pino-roll 版本不同，有的用 limit，有的用 mkdir）
        //           limit: { count: 7 },
        //           // 开启异步写入，提升性能
        //           sync: false,
        //         },
        //       },

        transport: {
          targets: [
            process.env.NODE_ENV !== 'production'
              ? {
                  level: 'info',
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                }
              : {
                  level: 'info',
                  target: 'pino-roll',
                  options: {
                    file: path.join('log2', 'log2.txt'),
                    frequency: 'daily', // hourly
                    size: '10m',
                    mkdir: true,
                  },
                },
          ],
        },

        // 自定义日志级别
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',

        // 可选：如果你想让日志里的时间戳变成人类可读的格式
        // 默认是 Epoch 时间（毫秒数）
        timestamp: () => `,"time":"${new Date().toISOString()}"`,

        // 忽略健康检查路由的日志输出
        // 例如，忽略 /health 路径的日志输出
        autoLogging: {
          ignore: (req) =>
            req.url === '/health' ||
            req.url === '/favicon.ico' ||
            req.url === '/.well-known/appspecific/com.chrome.devtools.json',
        },

        // 自定义日志内容，比如脱敏（隐藏密码等敏感信息）
        redact: {
          paths: [
            'req.headers.authorization',
            'req.body.password',
            'req.body.token',
          ],
          censor: '[REDACTED]',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 使用 APP_INTERCEPTOR 令牌注册，Nest 会自动处理依赖注入
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
