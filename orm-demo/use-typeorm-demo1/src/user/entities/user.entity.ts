import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 注意：使用 import type，编译后这行会被抹除，不产生运行时循环依赖
import type { Profile } from './profile.entity.js';
import type { Logs } from '../../logs/entities/logs.entity.js';
import type { Roles } from '../../roles/entities/roles.entity.js';

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

  // 设置一对多关系 (一个用户对应多条日志)
  // TypeORM 在按字符串找实体时，是严格区分大小写和单复数的
  @OneToMany('Logs', 'user') // 被拥有方：用字符串 'Log' 指向对方，反向关系是对方的 user 属性
  logs: Logs[];

  // 设置多对多关系 (一个用户对应多个角色，一个角色对应多个用户)
  @ManyToMany('Roles', 'users') // 被拥有方：用字符串 'Roles' 指向对方，反向关系是对方的 users 属性
  // @JoinTable({ name: 'user_roles' }) // 建立多对多关系 关联关系表。指定中间表名为"user_roles"，否则默认表名为"user_roles_roles"
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
  roles: Roles[]; // 这里先用 any[]，后面再改成 Roles[]

  // 当需要在 关联关系 本身上添加额外字段时，可以使用 @JoinTable() 的 options 参数，指定中间表的实体类
  // 当需要在 关联关系 本身上添加额外信息时，比如分配时间、操作人，角色的过期时间 等。就必须放弃 @ManyToMany() 的简化写法，改用 @OneToMany() + @ManyToOne() 的方式，自己定义中间表实体类。

  // @JoinTable() 的 options 参数 能加额外字段吗？
  // 不能。 @JoinTable 的 options 里没有可以添加普通业务字段（如 createdAt、status）的属性。
  // 如果强行在中间表加字段，TypeORM 在同步表结构时会忽略它们，或者在查询时报错。这也是为什么一旦你需要在关联表上存业务数据，就必须放弃 @ManyToMany，采用我们之前说的“手动拆分中间表实体”方案。
}
