import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              headers: {
                'user-agent': req.headers['user-agent'],
              },
              id: req.id,
              ip: req.raw.ip || req.raw.socket?.remoteAddress || req.ip,
              // 只截取 Body，且最好限制大小（这里简单演示直接透传，配合下面的 redact 使用）
              body: req.raw.body,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,

        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',

        timestamp: () => `,"time":"${new Date().toISOString()}"`,

        autoLogging: {
          ignore: (req) =>
            req.url === '/health' ||
            req.url === '/favicon.ico' ||
            req.url === '/.well-known/appspecific/com.chrome.devtools.json',
        },

        // 极其重要的脱敏配置（屏蔽敏感信息）
        redact: {
          paths: [
            'req.body.password',
            'req.body.oldPassword',
            'req.body.token',
            'req.headers.authorization',
          ],
          censor: '[REDACTED]', // 被屏蔽的内容会变成这个字符串
        },
      },
    }),
  ],
})
export class LogModule {}
