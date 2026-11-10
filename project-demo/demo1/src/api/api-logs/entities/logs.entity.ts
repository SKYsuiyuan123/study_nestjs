import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity.js';

@Entity('logs') // 指定表名为"logs"，否则默认表名为"logs"（类名的小写形式）
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ type: 'text', nullable: true }) // 设置为 text 类型，避免数据过长被截断
  data: string;

  @Column({ type: 'text', nullable: true })
  result: number;

  // 设置多对一关系 (多条日志对应一个用户) 这是拥有方，用箭头函数保留强类型。
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'userId' }) // 明确告诉 TypeORM，数据库里的外键列名叫 userId
  user: User;
}
