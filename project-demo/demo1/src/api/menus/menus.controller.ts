import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseWrapper } from '../../common/dto/api-response.dto.js';

import { MenusService } from './menus.service.js';
import { CreateMenuDto, CreateMenuResDto } from './dto/create-menu.dto.js';
import { UpdateMenuDto } from './dto/update-menu.dto.js';
import { QueryMenuListResDto, QueryMenuResDto } from './dto/query-menu.dto.js';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiResponseWrapper(CreateMenuResDto, false, '创建菜单')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有菜单' })
  @ApiResponseWrapper(QueryMenuListResDto, true, '获取所有菜单')
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取菜单' })
  @ApiResponseWrapper(QueryMenuResDto, false, '根据ID获取菜单')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据ID更新菜单' })
  @ApiResponseWrapper(CreateMenuResDto, false, '根据ID更新菜单')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除菜单' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
