import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity.js';
import { Menus } from '../../menus/entities/menus.entity.js';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 设置唯一约束
  name: string;

  @Column()
  description: string;

  // 设置多对多关系 (一个角色对应多个用户，一个用户对应多个角色)
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Menus, (menus) => menus.role)
  menus: Menus[];
}
