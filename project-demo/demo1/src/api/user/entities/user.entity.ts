import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Profile } from './profile.entity.js';
import type { Logs } from '../../api-logs/entities/logs.entity.js';

@Entity('users') // 指定表名为"users"，否则默认表名为"user"（类名的小写形式）
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 设置唯一约束
  username: string;

  @Column()
  password: string;

  @OneToOne('Profile', 'user') // 被拥有方：用字符串 'Profile' 指向对方，反向关系是对方的 user 属性
  profile: Profile;

  // TypeORM 在按字符串找实体时，是严格区分大小写和单复数的
  @OneToMany('Logs', 'user') // 被拥有方：用字符串 'Logs' 指向对方，反向关系是对方的 user 属性
  logs: Logs[];
}
