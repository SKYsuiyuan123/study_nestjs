import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from './entities/role.entity.js';

import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private readonly roleRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.roleRepository.create(createRoleDto);
      const res = await this.roleRepository.save(role);
      return res;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BusinessException(
          '角色名已存在',
          'ROLE_NAME_ALREADY_EXISTS',
          400,
        );
      }
    }
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // preload 是 TypeORM 提供的一个用于安全更新数据的方法。
    const role = await this.roleRepository.preload({
      // preload() 方法用于根据给定的 ID 查找现有实体，并将其与提供的更新数据合并。如果找不到实体，则返回 undefined。
      id,
      ...updateRoleDto,
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return this.roleRepository.save(role);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
