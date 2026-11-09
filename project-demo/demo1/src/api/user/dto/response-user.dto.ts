import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// 定义返回的 Schema
const UserResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    username: z.string(),
    password: z.string(),
  }),
});

// 包装成 类
export class CreateUserResponseDto extends createZodDto(UserResponseSchema) {}
