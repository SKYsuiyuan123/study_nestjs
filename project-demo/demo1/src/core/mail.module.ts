import { join } from 'path';

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigEnum } from '../common/enum/config.enum.js';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailHost = configService.get<string>(ConfigEnum.MAIL_HOST);
        const mailUser = configService.get<string>(ConfigEnum.MAIL_USER);
        const mailPassword = configService.get<string>(
          ConfigEnum.MAIL_PASSWORD,
        );
        const mailFrom = configService.get<string>(ConfigEnum.MAIL_FROM);

        return {
          transport: {
            host: mailHost,
            // 465 端口：必须配 secure: true（隐式 SSL）
            // 587 端口：必须配 secure: false（显式 STARTTLS）
            secure: true, // 587 端头通常用 STARTTLS
            auth: {
              user: mailUser,
              pass: mailPassword,
            },
          },
          defaults: {
            from: `"Sky" <${mailFrom}>`,
          },
          template: {
            dir: join(import.meta.dirname, '..', 'assets/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailModule {}
