import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { GetUsersQueryDto } from './dto/query-user.dto.js';

import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly pinoLogger: PinoLogger,
  ) {
    // 设置当前类的上下文 (日志里会显示 [AppController] 前缀)
    this.pinoLogger.setContext(UserService.name);
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(query: GetUsersQueryDto): Promise<User[]> {
    this.pinoLogger.info({ query }, 'findAll called');

    // 动态构建查询条件
    const whereCondition: any = {};

    if (query.username) {
      whereCondition.username = query.username;
      // whereCondition.username = Like(`%${query.username}%`); // 支持模糊查询
    }

    if (query.gender) {
      // 过滤关联表的 profile.gender。
      whereCondition.profile = { gender: Number(query.gender) }; // 注意：这里的 gender 是字符串类型，需要转换为数字类型。
    }

    return this.userRepository.find({
      where: whereCondition,
      skip: (query.pageNumber - 1) * query.pageSize, // 跳过的数量
      take: query.pageSize, // 每页个数
      relations: {
        profile: true,
        logs: true,
      },
      select: { // 只选择需要的字段，避免返回敏感信息。
        id: true,
        username: true,
        profile: {
          gender: true,
          address: true,
        },
      },
    });
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  getUserProfileInfoByUserId(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true, // 关联查询
      },
    });
  }
}
