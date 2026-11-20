import { Controller, Get, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

import { REDIS_CLIENT } from './core/redis.module.js';

import { NoWrap } from './common/decorators/noWrap.decorator.js';
import { Public } from './common/decorators/public.decorator.js';
import { NotificationService } from './common/services/notification.service.js';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pinoLogger: PinoLogger,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly notificationService: NotificationService,
  ) {
    this.pinoLogger.setContext(AppController.name); // 设置日志上下文为 AppController
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public() // @Public 装饰器用于标记该接口为公开访问，不需要身份验证。
  @Get('health')
  @NoWrap() // @NoWrap 装饰器用于告诉 NestJS 不要对该接口的响应进行包装，直接返回原始数据。
  healthCheck(): {
    status: string;
    timestamp: string;
    [key: string]: any;
  } {
    const logMemory = this.appService.logMemory();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...logMemory,
    };
  }

  @Public() // @Public 装饰器用于标记该接口为公开访问，不需要身份验证。
  @Get('redis-cache')
  async getTestCache() {
    // ioredis 客户端已经在 RedisModule 中全局注册，可以通过注入 REDIS_CLIENT 来使用。
    const cached = await this.redisClient.get('test_key');

    if (cached) {
      return { catchVale: cached };
    }

    const value = 'Hello from Redis!';
    await this.redisClient.set('test_key', value, 'EX', 60); // 设置缓存，过期时间为 60 秒

    return { catchVale: value };
  }

  // 发送 纯文本 / 简单 HTML 邮件
  @Public()
  @Get('send-simple-email')
  async sendSimpleEmail() {
    const to = '13011316073@163.com';
    const subject = '测试1';
    const text = '这是一封测试邮件';

    this.notificationService
      .sendSimpleEmail(to, subject, text)
      .then(() => {
        this.pinoLogger.info('邮件发送成功');
      })
      .catch((error) => {
        this.pinoLogger.warn('邮件发送失败:', error);
      });

    return { message: '邮件发送成功' };
  }

  // 发送模板邮件
  @Public()
  @Get('send-template-email')
  async sendTemplateEmail() {
    const to = '13011316073@163.com';
    const username = 'Sky-';

    this.notificationService
      .sendWelcomeEmail(to, username)
      .then(() => {
        this.pinoLogger.info('模板邮件发送成功');
      })
      .catch((error) => {
        this.pinoLogger.warn('模板邮件发送失败:', error);
      });

    return { message: '模板邮件发送成功' };
  }
}
