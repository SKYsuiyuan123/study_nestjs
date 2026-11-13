import { SetMetadata } from '@nestjs/common';

import { RolesEnum } from '../enum/roles.enum.js';
import { ConstantEnum } from '../enum/constant.enum.js';

export const Roles = (...roles: RolesEnum[]) =>
  SetMetadata(ConstantEnum.ROLES_KEY, roles);
