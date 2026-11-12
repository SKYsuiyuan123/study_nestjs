import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createRoleSchema = z.object({
  name: z
    .string({
      error: (v) =>
        v.input === undefined ? '角色名称不能为空' : '角色名称必须是字符串',
    })
    .min(1, { error: '角色名称不能为空' })
    .refine((val) => val !== undefined, { message: '角色名称不能为空' })
    .describe('角色名称'),
  description: z
    .string({
      error: (issue) =>
        issue.input === undefined ? '角色描述不能为空' : '角色描述必须是字符串',
    })
    .min(1, { error: '角色描述不能为空' })
    .refine((val) => val !== undefined, { message: '角色描述不能为空' })
    .describe('角色描述'),
});

export class CreateRoleDto extends createZodDto(createRoleSchema) {}

const createRolesResSchema = z.object({
  id: z.number().describe('角色ID'),
  name: z.string().describe('角色名称'),
  description: z.string().describe('角色描述'),
});

export class CreateRolesResDto extends createZodDto(createRolesResSchema) {}
