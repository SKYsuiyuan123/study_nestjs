import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // 指定表名为"users"，否则默认表名为"user"（类名的小写形式）
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
