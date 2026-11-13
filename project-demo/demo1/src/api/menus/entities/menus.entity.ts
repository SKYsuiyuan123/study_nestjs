import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Roles } from '../../roles/entities/role.entity.js';

@Entity('menus')
export class Menus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  order: number;

  @Column()
  acl: string; // 5 个操作策略。CREATE, READ, UPDATE, DELETE, MANAGE

  // 设置多对多关系 (多条菜单对应多个角色) 这是拥有方，用箭头函数保留强类型。
  @ManyToMany('Roles', 'menus') // 指定关联的实体类为 Roles，反向关系为 menus
  @JoinTable({ name: 'role_menus' }) // 指定中间表名为 role_menus
  role: Roles;
}
