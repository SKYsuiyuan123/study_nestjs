import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity.js';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 设置多对多关系 (一个角色对应多个用户，一个用户对应多个角色)
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
