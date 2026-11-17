import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConstantsEnum } from '../common/enum/config.enum.js';

import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { UserRepository } from './use.repository.js';

import { User } from './entities/user.entity.js';
import { Profile } from './entities/profile.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    TypeOrmModule.forFeature(
      [User, Profile],
      ConstantsEnum.DB2_CONNECTION_NAME,
    ),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
