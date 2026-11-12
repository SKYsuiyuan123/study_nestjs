import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { ConfigEnum } from '../../common/enum/config.enum.js';

import { User } from '../user/entities/user.entity.js';
import { JwtPayload } from './jwt-payload.type.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取JWT
      ignoreExpiration: false, // 是否忽略过期时间
      secretOrKey:
        configService.get<string>(ConfigEnum.JWT_SECRET) || 'default_secret', // 秘钥
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<{ userId: number; username: string }> {
    // 根据 payload 中的 用户id 查询数据库，验证用户是否存在
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    // 返回值会挂载到 req.user 上
    return { userId: payload.sub, username: payload.username };
  }
}
