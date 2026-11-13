import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenusService } from './menus.service.js';
import { MenusController } from './menus.controller.js';

import { Menus } from './entities/menus.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Menus])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
