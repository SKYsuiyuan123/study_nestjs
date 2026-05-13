import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { ConfigEnum } from 'src/common/enum/config.enum';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name, { timestamp: true });

  constructor(
    private readonly configService: ConfigService,
    private readonly pinoLogger: PinoLogger,
  ) {
    this.pinoLogger.setContext(UserService.name);
  }

  getUserList() {
    const db_name = this.configService.get<string>(ConfigEnum.DB_NAME);

    this.logger.log(`db_name222: ${db_name}`);

    this.pinoLogger.info(`db_name333: ${db_name}`);
    this.pinoLogger.info('非常正确的走到这了。。。');

    return 'Hello user list.';
  }
}
