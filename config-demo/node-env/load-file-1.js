// 调用内置函数加载 .env 文件

// 1. 使用 process 内置对象 来加载 .env 文件

// 注意：会修改 process.env 对象, 使其包含 .env 文件中定义的环境变量

import process from "node:process";

const envFilePath = ".env";

process.loadEnvFile(envFilePath);

console.log("process.env.PORT ==>", process.env.PORT);
