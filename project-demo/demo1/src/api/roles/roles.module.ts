import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';
import { Roles } from './entities/role.entity.js';
import { User } from '../user/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, User])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
