import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createMenuSchema = z.object({
  name: z.string().min(1, '菜单名为必填项').max(50, '菜单名不能超过50个字符'),
  path: z
    .string()
    .min(1, '菜单路径为必填项')
    .max(100, '菜单路径不能超过100个字符'),
  order: z.number().min(1, '菜单顺序必须为正整数'),
  acl: z
    .string()
    .min(1, '菜单权限为必填项')
    .max(50, '菜单权限不能超过50个字符'),
});

export class CreateMenuDto extends createZodDto(createMenuSchema) {}

const createMenuResSchema = z.object({
  id: z.number(),
  path: z.string(),
  order: z.number(),
  acl: z.string(),
});

export class CreateMenuResDto extends createZodDto(createMenuResSchema) {}
