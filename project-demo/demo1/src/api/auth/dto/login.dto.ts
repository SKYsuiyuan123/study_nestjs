import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 使用 z.object({...}) 定义 Schema，经过 nestjs-zod 校验后，那些没有在 Schema 中声明的字段会被自动剥离，不会出现在最终的 DTO 对象里。
// Zod 的 z.object() 默认就相当于 class-validator 中 ValidationPipe 的 whitelist: true 选项。

// 如果你不仅想丢弃，还希望当用户传入未定义字段时直接返回 400 错误（类似 forbidNonWhitelisted），
// 可以使用 z.strictObject() 代替 z.object()：

const LoginSchema = z.object({
  username: z
    .string({
      error: (issue) =>
        issue.input === undefined ? '用户名不能为空' : '用户名必须是字符串',
    })
    .min(1, { error: '用户名不能为空' })
    .refine((val) => val !== undefined, { message: '用户名不能为空' })
    .describe('用户名'),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? '密码不能为空' : '密码必须是字符串',
    })
    .min(1, '密码不能为空')
    .describe('密码'),
});

export class LoginDto extends createZodDto(LoginSchema) {}

const LoginResSchema = z.object({
  accessToken: z.string().describe('JWT访问令牌'),
});

export class LoginResDto extends createZodDto(LoginResSchema) {}
