import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { BusinessException } from '../../common/exceptions/business.exception.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { GetUsersQueryDto } from './dto/query-user.dto.js';

import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    private readonly pinoLogger: PinoLogger,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    // 设置当前类的上下文 (日志里会显示 [AppController] 前缀)
    this.pinoLogger.setContext(UserService.name);
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const res = await this.userRepository.save(newUser);
      return res;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        this.pinoLogger.error(
          { error, createUserDto },
          '创建用户失败，用户名已存在',
        );
        throw new BusinessException(
          '用户名已存在',
          'USERNAME_ALREADY_EXISTS',
          400,
        );
      }
    }
  }

  findAll(query: GetUsersQueryDto): Promise<User[]> {
    this.pinoLogger.info({ query }, 'findAll called');

    // 方法一：使用 Repository 的 find 方法
    // 动态构建查询条件
    // const whereCondition: any = {};

    // if (query.username) {
    //   whereCondition.username = query.username;
    //   // whereCondition.username = Like(`%${query.username}%`); // 支持模糊查询
    // }

    // if (query.gender) {
    //   // 过滤关联表的 profile.gender。
    //   whereCondition.profile = { gender: Number(query.gender) }; // 注意：这里的 gender 是字符串类型，需要转换为数字类型。
    // }

    // return this.userRepository.find({
    //   where: whereCondition,
    //   skip: (query.pageNumber - 1) * query.pageSize, // 跳过的数量
    //   take: query.pageSize, // 每页个数
    //   relations: {
    //     profile: true,
    //     logs: true,
    //   },
    //   select: {
    //     // 只选择需要的字段，避免返回敏感信息。
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //       address: true,
    //     },
    //   },
    // });

    // 方法二：使用 QueryBuilder
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoin('users.profile', 'profile')
      .select([
        'users.id AS userId',
        'users.username AS username',
        'profile.gender AS gender',
        'profile.address AS address',
      ]);
    // .leftJoinAndSelect('users.profile', 'profile');

    queryBuilder
      .where(
        query.username ? 'users.username = :username' : '1=1', // 如果没有 username 查询条件，设置一个恒为真的条件，避免报错。
        {
          username: query.username,
        },
      )
      .andWhere(query.gender ? 'profile.gender = :gender' : '1=1', {
        gender: query.gender,
      });

    return queryBuilder
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getRawMany(); // getRawMany() 返回原始数据，字段名为 select 中指定的别名。
    // .getMany(); // getMany() 返回实体对象，字段名为实体类中定义的属性名。
  }

  async findById(id: number): Promise<User | null> {
    const cacheKey = `user:${id}`;

    // 1. 先从缓存中获取用户信息
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      this.pinoLogger.info({ id }, '从缓存中获取用户信息');
      return cached;
    }

    // 2. 如果缓存中没有，则从数据库中查询用户信息
    const user = await this.userRepository.findOneBy({ id });

    // 或者使用 QueryBuilder 查询用户信息，并关联查询 profile 表。
    // const user = await this.userRepository
    //   .createQueryBuilder('users')
    //   // .innerJoinAndSelect('users.profile', 'profile') // 使用 innerJoinAndSelect 关联查询 profile 表，如果用户没有 profile，则查询不到用户。
    //   .leftJoinAndSelect('users.profile', 'profile') // 使用 leftJoinAndSelect 关联查询 profile 表，避免用户没有 profile 时查询不到用户。
    //   .where('users.id = :id', { id })
    //   .getOne();

    // 3. 将查询到的用户信息存入缓存，设置过期时间为 60 秒
    await this.cacheManager.set(cacheKey, user, 60 * 1000); // 注意：单位是毫秒，60 * 1000 = 60 秒

    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // 只适合单模型更新
    // return this.userRepository.update(id, updateUserDto);

    const userTemp = await this.findUserProfileInfoByUserId(id);

    if (userTemp === null) {
      throw new BusinessException('当前用户不存在', 'USER_NOT_FOUND', 404);
    }

    // 适合多模型更新，先查询再更新。
    // 联合更新：使用 merge 方法将查询到的实体对象和更新数据合并，然后再保存。这样可以触发实体的生命周期钩子函数。
    const newUser = this.userRepository.merge(userTemp, updateUserDto);

    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    const user = await this.findById(id);

    if (user === null) {
      throw new BusinessException('当前用户不存在', 'USER_NOT_FOUND', 404);
    }

    // 先查询再删除，触发实体的生命周期钩子函数。
    return this.userRepository.remove(user);
  }

  findUserProfileInfoByUserId(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true, // 关联查询
      },
    });
  }
}
