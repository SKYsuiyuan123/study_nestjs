import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const GetUsersQuerySchema = z.object({
  // 分页参数，使用 z.coerce.number() 将字符串类型的参数转换为数字类型，并设置默认值。
  pageNumber: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .describe('页码，默认值为 1'),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
    .describe('每页数量，默认值为 10，最大值为 100。'),

  // 可选参数
  username: z.string().optional().describe('按照名称搜索，可选参数'),

  // 布尔值转换 (注意：URL 里的 'true' 和 'false' 也是字符串)
  // z.coerce.boolean() 也可以用来转换布尔值，但它会将 'false' 转换为 true，因为它只检查是否存在值，而不检查值的内容。
  // z.coerce.boolean() 会把非空字符串都当做 true，所以最好自定义处理
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional()
    .describe('是否活跃，可选参数，true 或 false。'),

  gender: z
    .enum(['1', '0'])
    .optional()
    .describe('性别，可选参数，1 表示男性，0 表示女性。'),
});

// 包装成 NestJS 的 DTO 类
export class GetUsersQueryDto extends createZodDto(GetUsersQuerySchema) {}
