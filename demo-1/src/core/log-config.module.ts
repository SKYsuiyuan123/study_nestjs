import path from 'path';

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              level: 'info',
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            },
            {
              level: 'info',
              target: 'pino-roll',
              options: {
                file: path.join('log', 'log-info.txt'),
                frequency: 'daily',
                size: '10m',
                mkdir: true,
              },
            },
            {
              level: 'error',
              target: 'pino-roll',
              options: {
                file: path.join('log', 'log-error.txt'),
                frequency: 'daily',
                size: '10m',
                mkdir: true,
              },
            },
          ],
        },
      },
    }),
  ],
})
export class LogModule {}
