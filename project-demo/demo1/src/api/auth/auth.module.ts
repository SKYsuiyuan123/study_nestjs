import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { User } from '../user/entities/user.entity.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { ConfigEnum } from '../../common/enum/config.enum.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>(ConfigEnum.JWT_SECRET) || 'default_secret',
        signOptions: {
          // expiresIn 的值可以是一个字符串或数字，表示 JWT 的过期时间。字符串可以使用时间单位，如 '15m' 表示 15 分钟，'1h' 表示 1 小时，'7d' 表示 7 天等。数字表示秒数。
          // expiresIn: 3600 表示 1 小时
          expiresIn:
            configService.get<number>(ConfigEnum.JWT_EXPIRES_IN) || '15M',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
