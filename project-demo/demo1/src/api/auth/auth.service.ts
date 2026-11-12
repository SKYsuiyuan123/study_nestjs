import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { User } from '../user/entities/user.entity.js';

import { JwtPayload } from './jwt-payload.type.js';
import { LoginDto } from './dto/login.dto.js';
import { SignUpDto } from './dto/signup.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 密码哈希化处理
  private async hasPassword(plainPassword: string): Promise<string> {
    // 使用 OWASP 推荐的最低参数作为基准，生产环境可适当调高 memoryCost、timeCost 和 parallelism 参数。
    return argon2.hash(plainPassword, {
      type: argon2.argon2id, // argon2id 是一种结合了 argon2i 和 argon2d 的算法，兼顾了安全性和性能。
      memoryCost: 19456, // 19MB. 内存成本，单位为 KB
      timeCost: 2, // 时间成本，表示算法迭代的次数
      parallelism: 1, // 并行度，表示算法可以使用的线程数
    });
  }

  // 密码验证
  private async verifyPassword(
    hash: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      // 注意参数顺序: 先传数据库里的哈希，再传用户输入的明文密码。
      return await argon2.verify(hash, plainPassword);
    } catch (error) {
      // 如果 hash 格式化非法 (比如旧数据，或者被篡改)，argon2.verify 会抛出异常。此时我们可以认为验证失败。
      return false;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
      select: {
        id: true,
        username: true,
        password: true, // 👈 强制覆盖 User entity 默认的 select: false
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await this.verifyPassword(
      user.password,
      loginDto.password,
    );

    if (!isPasswordValid) {
      // 从安全角度考虑，不要暴露是用户名错误还是密码错误，统一返回“用户名或密码错误”。
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async signup(signUpDto: SignUpDto) {
    const existedUser = await this.userRepository.findOneBy({
      username: signUpDto.username,
    });

    if (existedUser) {
      throw new UnauthorizedException('用户名已存在');
    }

    const hashedPassword = await this.hasPassword(signUpDto.password);

    const newUser = this.userRepository.create({
      username: signUpDto.username,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return { message: '注册成功' };
  }
}
