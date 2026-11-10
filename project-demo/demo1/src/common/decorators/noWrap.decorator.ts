import { SetMetadata } from '@nestjs/common';

import { ConstStr } from '../enum/constant.enum.js';

export const NoWrap = () => SetMetadata(ConstStr.noWrap, true);
