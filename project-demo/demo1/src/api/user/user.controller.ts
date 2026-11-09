import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateUserResponseDto } from './dto/response-user.dto.js';

@ApiTags('用户管理') // @ApiTags 装饰器用于为 Swagger 文档中的该控制器添加标签，方便在 Swagger UI 中进行分类和查找。
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' }) // @ApiOperation 装饰器用于为 Swagger 文档中的该接口添加操作说明。
  @ApiOkResponse({ type: CreateUserResponseDto }) // @ApiOkResponse 装饰器用于为 Swagger 文档中的该接口添加响应说明，type 属性指定了响应的数据类型。
  create(@Body() createUserDto: CreateUserDto) {
    // dto 已经在 CreateUserDto 中定义了验证规则，NestJS 会自动进行验证，如果验证失败，会抛出异常并返回 400 错误。
    // dto 已经被 nestjs-zod 自动校验过，且类型安全
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
