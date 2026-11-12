import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Profile } from './profile.entity.js';
import type { Logs } from '../../api-logs/entities/logs.entity.js';
import type { Roles } from '../../roles/entities/role.entity.js';

@Entity('users') // 指定表名为"users"，否则默认表名为"user"（类名的小写形式）
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 设置唯一约束
  username: string;

  @Column({ select: false }) // 设置 select: false，表示默认查询时不返回该字段, 如果想返回 password 字段，需要在查询时显式指定 select: ['password']。
  password: string;

  @OneToOne('Profile', 'user', { cascade: true }) // 被拥有方：用字符串 'Profile' 指向对方，反向关系是对方的 user 属性
  profile: Profile;

  // TypeORM 在按字符串找实体时，是严格区分大小写和单复数的
  @OneToMany('Logs', 'user') // 被拥有方：用字符串 'Logs' 指向对方，反向关系是对方的 user 属性
  logs: Logs[];

  @ManyToMany('Roles', 'users') // 被拥有方：用字符串 'Roles' 指向对方，反向关系是对方的 users 属性
  @JoinTable({
    name: 'user_roles', // 1. 指定中间表名为"user_roles"，否则默认表名为"user_roles_roles"

    // 2. 当前实体在中间表中的外键列名和主键列名
    joinColumn: {
      name: 'userId', // 指定当前实体在中间表中的外键列名
      referencedColumnName: 'id', // 指定当前实体的主键列名
    },

    // 3. 对方实体在中间表中的外键列名和主键列名
    inverseJoinColumn: {
      name: 'roleId', // 指定对方实体在中间表中的外键列名
      referencedColumnName: 'id', // 指定对方实体的主键列名
    },
  })
  roles: Roles[];

  @AfterInsert()
  afterInsert() {
    console.log(`User entity inserted with id: ${this.id}`);
  }

  // 在删除实体后触发的钩子函数, 只有在实体被删除后才会触发, 如果使用软删除, 则不会触发。
  // remove 方法会触发, delete 方法不会触发。
  @AfterRemove()
  afterRemove() {
    console.log(`User entity removed with id: ${this.id}`);
  }
}
