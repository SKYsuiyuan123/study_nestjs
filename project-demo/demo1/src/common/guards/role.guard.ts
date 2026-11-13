import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../api/user/entities/user.entity.js';

import { RolesEnum } from '../enum/roles.enum.js';
import { ConstantEnum } from '../enum/constant.enum.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getAllAndMerge: 获取所有的元数据并合并成一个数组，优先级为方法 > 类
    // getAllAndOverride: 获取所有的元数据并覆盖，优先级为方法 > 类
    const requireRoles = this.reflector.getAllAndMerge<RolesEnum[]>(
      ConstantEnum.ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRoles || requireRoles.length === 0) {
      return true; // 如果没有指定角色要求，则允许访问
    }

    // jwt -> userId -> user -> roles

    const req = context.switchToHttp().getRequest();

    const user = await this.userRepository.findOne({
      where: { id: req.user?.userId },
      relations: {
        roles: true, // 关联查询角色信息
      },
    });

    const userRoleIds = user?.roles.map((role) => role.id) || [];

    const flag = requireRoles.some((role) => userRoleIds.includes(role));

    return flag; // 如果用户的角色中包含所需的角色，则允许访问，否则拒绝访问
  }
}
