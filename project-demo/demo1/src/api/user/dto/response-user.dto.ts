import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 定义返回的 Schema
const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
});

// 获取单个用户 (包装成 类)
export class UserDto extends createZodDto(UserSchema) {}

const UserListSchema = z.object({
  list: z.array(UserSchema),
  pageNumber: z.number(),
  pageSize: z.number(),
});

// 获取用户列表
export class UserListDto extends createZodDto(UserListSchema) {}
