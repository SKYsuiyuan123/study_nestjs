import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password, // 记得用 argon2 哈希后再存
        profile: createUserDto.profile // 如果 profile 存在，则创建 profile，否则不创建
          ? { create: createUserDto.profile }
          : undefined,
      },
      include: { profile: true }, // 如果需要返回 profile 信息，则加上 include
    });
  }

  findAll() {
    return this.prismaService.user.findMany({
      include: { profile: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { profile: true, logs: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists

    return this.prismaService.user.update({
      where: { id },
      data: {
        username: updateUserDto.username,
        password: updateUserDto.password, // 记得用 argon2 哈希后再存
        profile: updateUserDto.profile
          ? { update: updateUserDto.profile }
          : undefined, // 如果 profile 存在，则更新 profile，否则不更新
      },
      include: { profile: true }, // 如果需要返回 profile 信息，则加上 include
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if user exists
    return this.prismaService.user.delete({ where: { id } });
  }
}
