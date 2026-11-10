import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseWrapper } from '../../common/dto/api-response.dto.js';

import { User } from './entities/user.entity.js';
import { UserService } from './user.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import {
  UserDto,
  UserListDto,
  UserProfileDto,
} from './dto/response-user.dto.js';
import { GetUsersQueryDto } from './dto/query-user.dto.js';

@ApiTags('用户管理') // @ApiTags 装饰器用于为 Swagger 文档中的该控制器添加标签，方便在 Swagger UI 中进行分类和查找。
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' }) // @ApiOperation 装饰器用于为 Swagger 文档中的该接口添加操作说明。
  @ApiResponseWrapper(UserDto, false, '创建用户') // 使用自定义的 ApiResponseWrapper 装饰器，包装响应数据类型为 UserDto，并指定为非数组类型，描述为 '创建用户'。
  createUser(@Body() createUserDto: CreateUserDto) {
    // dto 已经在 CreateUserDto 中定义了验证规则，NestJS 会自动进行验证，如果验证失败，会抛出异常并返回 400 错误。
    // dto 已经被 nestjs-zod 自动校验过，且类型安全
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  @ApiResponseWrapper(UserListDto) // 使用自定义的 ApiResponseWrapper 装饰器，包装响应数据类型为 UserDto，并指定为数组类型，描述为 '获取用户列表'。
  async getAllUsers(
    @Query() query: GetUsersQueryDto,
  ): Promise<{ list: User[]; pageSize: number; pageNumber: number }> {
    // 此时的 query 已经被自动验证并转换了类型
    // query.pageNumber, query.pageSize 是 number 类型
    // query.isActive 是 boolean 类型
    const list = await this.userService.findAll(query);

    return {
      list,
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 用户ID 获取用户' })
  @ApiResponseWrapper(UserDto, false, '获取用户详情') // 使用自定义的 ApiResponseWrapper 装饰器，包装响应数据类型为 UserDto，并指定为非数组类型，描述为 '获取用户详情'。
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据 用户ID 更新用户' })
  @ApiResponseWrapper(UserProfileDto, false, '更新用户详情')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据 用户ID 删除用户' })
  @ApiOkResponse({}) // @ApiOkResponse 装饰器用于为 Swagger 文档中的该接口添加响应说明，type 属性指定了响应的数据类型。
  removeUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: '根据 用户ID 获取用户详情' })
  @ApiResponseWrapper(UserProfileDto, false, '获取用户详情')
  getUserProfileInfoByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findUserProfileInfoByUserId(userId);
  }
}
