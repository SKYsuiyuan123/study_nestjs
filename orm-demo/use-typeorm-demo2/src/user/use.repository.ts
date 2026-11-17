import { REQUEST } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';

import { ConstantsEnum } from '../common/enum/config.enum.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User, ConstantsEnum.DB2_CONNECTION_NAME)
    private readonly userRepository2: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  getRepository() {
    // 根据请求头中的连接名称来选择使用哪个数据库连接
    const connectionName = this.request.headers['x-connection-name'];

    if (connectionName === ConstantsEnum.DB2_CONNECTION_NAME) {
      return this.userRepository2;
    }

    return this.userRepository;
  }
}
