// SignUpResDto
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 注册请求参数验证规则
const SignUpSchema = z.object({
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

export class SignUpDto extends createZodDto(SignUpSchema) {}

// 注册响应.
const SignUpResSchema = z.object({
  message: z.string().describe('注册成功的提示信息'),
});

export class SignUpResDto extends createZodDto(SignUpResSchema) {}
