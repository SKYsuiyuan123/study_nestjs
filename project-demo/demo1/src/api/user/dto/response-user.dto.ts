import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 定义返回的 Schema
const UserDetailResSchema = z.object({
  id: z.number().describe('用户ID'),
  username: z.string().describe('用户名'),
});

// 获取单个用户 (包装成 类)
export class UserDetailResDto extends createZodDto(UserDetailResSchema) {}

const UserListSchema = z.object({
  list: z.array(UserDetailResSchema),
  pageNumber: z.number(),
  pageSize: z.number(),
});

// 获取用户列表
export class UserListDto extends createZodDto(UserListSchema) {}

const ProfileSchema = z.object({
  id: z.number().describe('用户详情 ID'),
  gender: z.number().describe('1: 男, 0: 女'),
  photo: z.string().describe('头像 URL'),
  address: z.string().describe('地址'),
});

const UserProfileInfoSchema = z.object({
  ...UserDetailResSchema.shape, // 继承 UserSchema 的属性
  profile: z.object(ProfileSchema.shape).nullable().describe('用户详情信息'),
});

// 获取用户详情
export class UserProfileDto extends createZodDto(UserProfileInfoSchema) {}
