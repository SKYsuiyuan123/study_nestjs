import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

import { User } from './entities/user.entity.js';
import { Profile } from './entities/profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
