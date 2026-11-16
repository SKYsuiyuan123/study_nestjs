import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}

  // 发送纯文本 / 简单 HTML
  async sendSimpleEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }

  // 发送模板邮件（需要提前在 templates 目录下创建 welcome.hbs）
  async sendWelcomeEmail(to: string, username: string) {
    await this.mailerService.sendMail({
      to,
      subject: '欢迎加入!',
      template: 'welcome', // 使用模板文件 templates/welcome.hbs
      context: {
        username, // 传给模版的变量
      },
    });
  }
}
