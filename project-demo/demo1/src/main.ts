import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module.js';

// 一个标准、规范的 main.ts 挂载顺序通常遵循：“先基础配置，再请求处理（由外到内），最后启动服务”。

async function bootstrap() {
  // 1. 创建应用 (开启日志缓冲)
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 2. 接管日志系统 (尽早接管，确保后续所有操作都能被记录)
  app.useLogger(app.get(Logger));

  // 3. 开启跨域 (CORS) (通常放在请求处理的最外层)
  app.enableCors({
    origin: '*', // 允许所有来源的请求
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  });

  // 4. 设置全局路由前缀 (在注册管道 / 守卫前设置)
  app.setGlobalPrefix('api', {
    // 排除健康检查端点
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 5. 挂载全局拦截器 (Interceptor) - 用于 请求/响应日志、耗时统计、统一响应数据格式化等
  // 6. 挂载全局守卫 (Guard) - 用于 权限校验、身份认证等
  // 7. 挂载全局管道 (Pipe) - 用于参数校验和转换 (ZodValidationPipe 等)
  // 8. 挂载全局过滤器 (Filter) - 用于捕获所有层级抛出的异常，格式化错误返回 (ZodExceptionFilter 等)

  // 9. 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('Nest Project Demo1')
    .setDescription('基于 NestJS V12 的项目示例')
    .setVersion('1.0')
    .addBearerAuth() // 添加 Bearer Token 认证支持
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 10. 开启优雅退出 (监听 SIGTERM，确保 Docker 下安全关闭) - 监听系统信号（如 Docker 里的 SIGTERM）
  app.enableShutdownHooks();

  // 11. 启动服务监听
  const port = process.env.SERVER_PORT ?? 3000;
  await app.listen(port);

  // 12. 打印启动成功日志
  app
    .get(Logger)
    .log(`🚀 Application is running on: http://localhost:${port}/api`);
}

await bootstrap();

// NestJS 处理一个 HTTP 请求的生命周期是：中间件 (Middleware) -> 守卫 (Guard) -> 拦截器 (Interceptor - 前) -> 管道 (Pipe) -> Controller (路由处理) -> 拦截器 (Interceptor - 后) -> 异常过滤器 (Filter)。
// 对于 main.ts 里的全局挂载，它们的执行顺序并不是严格按照代码书写的先后，但异常过滤器比较特殊：全局异常过滤器是最后捕获错误的。这意味着无论错误发生在哪个阶段，都会被它兜底。

// 1. 日志接管（第 2 步）：必须在所有挂载操作之前，否则后续注册路由、实例化类的报错就用不到 Pino 了。
// 2. 跨域和前缀（第 3、4 步）：属于应用级别的路由配置，应最先设定。
// 3. 守卫、管道、拦截器（第 5、6、7 步）：这三者通常在 main.ts 里挂载全局的，如果你是用依赖注入的方式
// （在 AppModule 里用 APP_GUARD 等），它们在底层也会按顺序生效。注意：管道必须在过滤器之前，因为管道抛出的异常（如 Zod 校验失败）要能被过滤器捕获。
// 4. Swagger（第 9 步）：因为 Swagger 会扫描你的 Controller 和 DTO，所以最好在所有的配置（尤其是管道等）都挂载好之后，再生成文档，这样它才能正确解析出类型信息。
// 5. 优雅退出（第 10 步）：在 listen 之前开启，确保应用运行期间随时能接收到退出信号，进行资源释放。
// 6. 启动监听（第 11 步）：把 app.listen() 放在最后，一旦监听成功，应用就进入运行状态。

// 💡 进阶最佳实践：在 Module 中注册全局组件
// 虽然我们可以在 main.ts 里用 app.useGlobalPipes 和 app.useGlobalFilters，但这会有一个问题：它们脱离了依赖注入 (DI) 容器。
// 如果你的管道、过滤器、拦截器里需要注入 ConfigService、PrismaService 或其他自定义服务，在 main.ts 里 new 出来是不行的。
// 更高级的写法是：把全局组件注册到 AppModule 里，这样你的 main.ts 会变得非常干净

// @Module({
//   providers: [
//     {
//       provide: APP_PIPE,
//       useClass: ZodValidationPipe,
//     },
//     {
//       provide: APP_FILTER,
//       useClass: ZodExceptionFilter,
//     },
//     // 如果需要注入依赖的拦截器，也可以在这里注册
//     // { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
//   ],
// })

// 使用这种 Module 注册方式的优点：
// 1. main.ts 里不需要写 app.useGlobalPipes 和 app.useGlobalFilters，代码极度清爽。
// 2. 这些全局组件自动享受 NestJS 的依赖注入，你可以在里面随意注入 PinoLogger、ConfigService 等。
// 3. 测试时更容易 Mock。
