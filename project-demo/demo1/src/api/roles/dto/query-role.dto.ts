import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const queryRoleResSchema = z.object({
  id: z.number().describe('角色ID'),
  name: z.string().describe('角色名称'),
  description: z.string().describe('角色描述'),
});

export class QueryRoleResDto extends createZodDto(queryRoleResSchema) {}

const queryRoleListResSchema = z.object({
  list: z.array(queryRoleResSchema),
  pageNumber: z.number().describe('当前页码'),
  pageSize: z.number().describe('每页数量'),
});

export class QueryRoleListResDto extends createZodDto(queryRoleListResSchema) {}
