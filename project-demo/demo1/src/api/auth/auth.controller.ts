import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator.js';
import { ApiResponseWrapper } from '../../common/dto/api-response.dto.js';

import { AuthService } from './auth.service.js';
import { LoginDto, LoginResDto } from './dto/login.dto.js';
import { SignUpDto, SignUpResDto } from './dto/signup.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public() // 标记该路由为公开访问，不需要身份验证
  @ApiOperation({
    summary: '用户登录',
    description: '用户登录接口，返回 JWT token。',
  })
  @ApiResponseWrapper(LoginResDto, false, '成功')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @Public()
  @ApiOperation({
    summary: '用户注册',
    description: '用户注册接口，创建新用户。',
  })
  @ApiResponseWrapper(SignUpResDto, false, '成功')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Get('profile')
  @ApiBearerAuth() // 表示该接口需要使用 Bearer Token 进行身份验证, Swagger 显示锁图标。
  @ApiOperation({ summary: '获取当前登陆用户信息' })
  getProfile(@Req() req: any) {
    return req.user;
  }
}
