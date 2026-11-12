import { SetMetadata } from '@nestjs/common';

import { ConstantEnum } from '../enum/constant.enum.js';

// @NoWrap 装饰器用于告诉 NestJS 不要对该接口的响应进行包装，直接返回原始数据。
export const NoWrap = () => SetMetadata(ConstantEnum.noWrap, true);
