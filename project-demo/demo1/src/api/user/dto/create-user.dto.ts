import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 1. 定义 Zod Schema
const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: '用户名至少为 3 个字符' })
    .describe('用户名'),
  // nestjs-zod 会自动读取 .describe() 的内容，将其作为 Swagger 文档中该字段的 description。
  password: z.string().min(6, '密码至少为 6 个字符').describe('密码'),
});

// 2. 包装成 Nest DTO 类
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
