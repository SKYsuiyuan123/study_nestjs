import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 1. 定义 Zod Schema
const CreateUserSchema = z.object({
  username: z
    .string({
      error: (issue) =>
        issue.input === undefined ? '用户名不能为空' : '用户名必须是字符串',
    })
    .min(3, { message: '用户名长度最少为 3位' })
    .describe('用户名'),
  // nestjs-zod 会自动读取 .describe() 的内容，将其作为 Swagger 文档中该字段的 description。
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? '密码不能为空' : '密码必须是字符串',
    })
    .min(6, '密码至少为 6 个字符')
    .describe('密码'),
});

// 2. 包装成 Nest DTO 类
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
