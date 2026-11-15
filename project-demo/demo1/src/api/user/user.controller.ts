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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

import { ApiResponseWrapper } from '../../common/dto/api-response.dto.js';
import { UserCacheInterceptor } from '../../common/interceptors/custom-cache.interceptor.js';

import { User } from './entities/user.entity.js';
import { UserService } from './user.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import {
  UserDetailResDto,
  UserListDto,
  UserProfileDto,
} from './dto/response-user.dto.js';
import { GetUsersQueryDto } from './dto/query-user.dto.js';

@ApiTags('用户管理') // @ApiTags 装饰器用于为 Swagger 文档中的该控制器添加标签，方便在 Swagger UI 中进行分类和查找。
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' }) // @ApiOperation 装饰器用于为 Swagger 文档中的该接口添加操作说明。
  @ApiResponseWrapper(UserDetailResDto, false, '创建用户') // 使用自定义的 ApiResponseWrapper 装饰器，包装响应数据类型为 UserDto，并指定为非数组类型，描述为 '创建用户'。
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
  // @UseInterceptors(CacheInterceptor) // 使用 CacheInterceptor 拦截器来缓存该接口的响应结果，避免频繁访问数据库，提高性能。
  // 直接使用 CacheInterceptor 会有一些问题：
  // @nestjs/cache-manager 自带的 CacheInterceptor 默认只会用请求的 URL 作为 Key。
  // 如果你的接口是 /user/profile，且当前用户是 sky 访问，URL 就是 /user/profile。下一个用户 admin 访问，URL 还是 /user/profile。
  // CacheInterceptor 就会直接把 sky 的数据返回给 admin，这是灾难性的数据泄露。
  // 所以，绝对不能在有用户状态区分的接口上直接裸用默认的 CacheInterceptor。
  @UseInterceptors(UserCacheInterceptor)

  // (这里缓存的数据是基于请求参数的，所以不同的请求参数会有不同的缓存结果，并且缓存数据是存放在 CacheManager 中的(目前的对接的 Redis 中)。)
  @CacheKey('user_detail') // 使用 CacheKey 装饰器来指定缓存的 key，这样可以避免缓存冲突。
  @CacheTTL(60 * 1000) // 使用 CacheTTL 装饰器来指定缓存的过期时间，这里设置为 60 秒。
  @ApiOperation({ summary: '根据 用户ID 获取用户' })
  @ApiResponseWrapper(UserDetailResDto, false, '获取用户详情') // 使用自定义的 ApiResponseWrapper 装饰器，包装响应数据类型为 UserDto，并指定为非数组类型，描述为 '获取用户详情'。
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
