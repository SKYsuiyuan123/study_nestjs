import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// 注意：使用 import type，编译后这行会被抹除，不产生运行时循环依赖
import type { Profile } from './profile.entity.js';

@Entity('user') // 指定表名为"user"，否则默认表名为"user"（类名的小写形式）
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // 设置一对一关系，User是关系的拥有方，Profile是被拥有方。
  // 推荐：使用字符串，或者反向关系的箭头函数
  // 更安全的写法其实是把反向关系也写成箭头函数，但配合 import type
  // 不过为了彻底避开 ESM 报错，用字符串也是 TypeORM 官方支持的
  @OneToOne('Profile', 'user') // 被拥有方：用字符串 'Profile' 指向对方，反向关系是对方的 user 属性
  profile: Profile;
}
