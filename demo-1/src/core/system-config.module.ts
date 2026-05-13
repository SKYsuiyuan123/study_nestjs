import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';

import { ConfigEnum } from 'src/common/enum/config.enum';

// 可以借助 cross-env NODE_ENV 来设置 读取不同的环境变量文件
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

// console.log('aa', dotenv.config({ path: '.env-test-1' })); // { parsed: { DB_NAME: 'test-db-1', DB_TYPE: 'mysql' } }

// console.log(process.env);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFile, '.env'], // 前边的文件内容具有较高的优先级，即 前边的同名环境变量 会覆盖后边的。
      load: [() => dotenv.config({ path: '.env-test-1' })], // 使用 dotenv.config 加载一个配置文件，最终会跟 envFilePath 合并到一起。
      // 同名配置
      //  process.env 和 envFilePath 的覆盖关系是，前者覆盖后者。
      //  envFilePath 和 load 的覆盖关系是：如果都正常在 ConfigModule 里书写 前者覆盖后者，如果先加载了 dotenv.config 后写 ConfigModule 则 后者覆盖前者。
      //  load --> envFilePath --> process.env => configService 的值。

      //  dotenv 就是把 配置文件里的值写进 process.env 里。dotenv 就是 .env → process.env 的搬运工，配置的所有变量，最终都是通过 process.env.XXX 来使用的。
      //  默认情况下，已存在于 process.env 中的环境变量优先级更高，不会被 .env 文件中的同名变量覆盖。

      validationSchema: Joi.object({
        [ConfigEnum.DB_HOST]: Joi.string().ip().required(), // 被 required 的字段，必须在 envFilePath 合成的 环境变量里，否则会报错。
        [ConfigEnum.DB_PORT]: Joi.number()
          .default(3306)
          .valid(3306, 3308, 3080), // 验证 DB_PORT 的值 只能是一个数字，并且 只能是 3306, 3308, 3310 中的一个。默认 3306
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'), // 设置启动命令 命令行的 NODE_ENV 只能是 development 或者 production
        [ConfigEnum.DB_NAME]: Joi.string().required(),
        [ConfigEnum.DB_USER_NAME]: Joi.string().required(),
        [ConfigEnum.DB_PASSWORD]: Joi.string().required(),
        [ConfigEnum.DB_SYNC]: Joi.boolean().default(false),
      }),
    }),
  ],
})
export class SystemConfigModule {}
