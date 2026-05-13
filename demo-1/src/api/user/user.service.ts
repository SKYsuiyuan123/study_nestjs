import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum } from 'src/common/enum/config.enum';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  getUserList() {
    const db_name = this.configService.get<string>(ConfigEnum.DB_NAME);

    console.log('db_name:', db_name);

    return 'Hello user list.';
  }
}
