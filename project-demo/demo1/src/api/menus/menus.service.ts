import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';

import { Menus } from './entities/menus.entity.js';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menus)
    private readonly menusRepository: Repository<Menus>,
  ) {}

  create(createMenuDto: CreateMenuDto) {
    const menu = this.menusRepository.create(createMenuDto);
    return this.menusRepository.save(menu);
  }

  findAll() {
    return this.menusRepository.find();
  }

  findOne(id: number) {
    return this.menusRepository.findOneBy({ id });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.menusRepository.preload({ id, ...updateMenuDto });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    return this.menusRepository.save(menu);
  }

  remove(id: number) {
    return this.menusRepository.delete(id);
  }
}
