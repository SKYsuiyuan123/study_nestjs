import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './api/user/user.module';

// 可以借助 cross-env NODE_ENV 来设置 读取不同的环境变量文件
const envFile = `.env.${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`;

// console.log('aa', dotenv.config({ path: '.env-test-1' })); // { parsed: { DB_NAME: 'test-db-1', DB_TYPE: 'mysql' } }

// console.log(process.env);

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'], // 前边的文件内容具有较高的优先级，会覆盖后边的。
      load: [() => dotenv.config({ path: '.env-test-1' })], // 使用 dotenv.config 加载一个配置文件，最终会跟 envFilePath 合并到一起。
      // 同名配置
      //  process.env 和 envFilePath 的覆盖关系是，前者覆盖后者。
      //  envFilePath 和 load 的覆盖关系是：如果都正常在 ConfigModule 里书写 前者覆盖后者，如果先加载了 dotenv.config 后写 ConfigModule 则 后者覆盖前者。
      //  load --> envFilePath --> process.env => configService 的值。

      //  dotenv 就是把 配置文件里的值写进 process.env 里。dotenv 就是 .env → process.env 的搬运工，配置的所有变量，最终都是通过 process.env.XXX 来使用的。
      //  默认情况下，已存在于 process.env 中的环境变量优先级更高，不会被 .env 文件中的同名变量覆盖。
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
