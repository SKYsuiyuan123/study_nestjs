import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity.js';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  // 设置一对一关系，Profile是关系的被拥有方，User是拥有方。
  // 推荐：在关系的被拥有方使用箭头函数，保留强类型检查。
  @OneToOne(() => User, (user) => user.profile) // 拥有方：使用箭头函数保留强类型，并在 @JoinColumn 中指定外键字段名
  @JoinColumn({ name: 'userId' }) // 明确告诉 TypeORM，数据库里的外键列名叫 userId
  user: User;
}
