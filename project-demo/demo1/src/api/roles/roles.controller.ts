import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesEnum } from '../../common/enum/roles.enum.js';
import { ApiResponseWrapper } from '../../common/dto/api-response.dto.js';
import { RoleGuard } from '../../common/guards/role.guard.js';

import { RolesService } from './roles.service.js';
import { CreateRoleDto, CreateRolesResDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { QueryRoleListResDto, QueryRoleResDto } from './dto/query-role.dto.js';

@ApiTags('角色管理')
@ApiBearerAuth()
@Roles(RolesEnum.Admin)
@UseGuards(RoleGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponseWrapper(CreateRolesResDto, false, '创建用户')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有角色' })
  @ApiResponseWrapper(QueryRoleListResDto, true, '获取所有角色')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取角色' })
  @ApiResponseWrapper(QueryRoleResDto, false, '根据ID获取角色')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据ID更新角色' })
  @ApiResponseWrapper(CreateRolesResDto, false, '根据ID更新角色')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除角色' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
