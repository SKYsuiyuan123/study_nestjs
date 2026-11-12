import { SetMetadata } from '@nestjs/common';

import { ConstantEnum } from '../enum/constant.enum.js';

// 声明一个自定义装饰器，用于标记某个路由为公开访问，不需要身份验证。
export const Public = () => SetMetadata(ConstantEnum.IS_PUBLIC_KEY, true);
