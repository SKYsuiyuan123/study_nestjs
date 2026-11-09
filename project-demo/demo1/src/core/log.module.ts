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
              ip: req.ip,
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
})
export class LogModule {}
