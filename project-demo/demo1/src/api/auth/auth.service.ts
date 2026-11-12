import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({
      username: loginDto.username,
    });

    if (!user || user.password !== loginDto.password) {
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

    const newUser = this.userRepository.create({
      username: signUpDto.username,
      password: signUpDto.password,
    });

    await this.userRepository.save(newUser);
    return { message: '注册成功' };
  }
}
