import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const queryMenuResSchema = z.object({
  id: z.number().describe('角色ID'),
  name: z.string().describe('角色名称'),
  description: z.string().describe('角色描述'),
});

export class QueryMenuResDto extends createZodDto(queryMenuResSchema) {}

const queryMenuListResSchema = z.object({
  list: z.array(queryMenuResSchema),
  pageNumber: z.number().describe('当前页码'),
  pageSize: z.number().describe('每页数量'),
});

export class QueryMenuListResDto extends createZodDto(queryMenuListResSchema) {}
