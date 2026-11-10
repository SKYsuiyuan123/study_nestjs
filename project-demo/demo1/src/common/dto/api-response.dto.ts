import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// 1. 定义基础的外壳 Schema
export const BaseResponseSchema = z.object({
  status: z.number().describe('HTTP 状态码'),
  message: z.string().describe('提示信息'),
  timestamp: z.string().describe('服务器时间戳'),
});
export class BaseResponseDto extends createZodDto(BaseResponseSchema) {}

/**
 * 公共泛型包装函数
 * @param DataDto 具体的业务数据 DTO 类（由 createZodDto 生成的类）
 * @param isArray 是否是数组（比如列表查询就是 true）
 * @param description 接口描述
 */
export function ApiResponseWrapper<T>(
  DataDto: new (...args: any[]) => T,
  isArray: boolean = false,
  description: string = '成功',
) {
  return applyDecorators(
    // 注册基础外壳 DTO，确保 Swagger 能识别
    ApiExtraModels(BaseResponseDto, DataDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            type: 'object',
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(DataDto) },
                  }
                : { $ref: getSchemaPath(DataDto) },
            },
          },
        ],
      },
    }),
  );
}
