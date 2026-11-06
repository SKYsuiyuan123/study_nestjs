// 调用内置函数加载 .env 文件

// 2. 使用 util.parseEnv() 来解析一个包含环境变量赋值的字符串, 并返回一个对象, 该对象的键是环境变量的名称, 值是环境变量的值

// 注意：不会修改 process.env 对象, 只会返回一个新的对象。

import util from "node:util";
import { readFileSync } from "node:fs";

const envFilePath = ".env";
const envFileContent = readFileSync(envFilePath, "utf-8");

const envObj = util.parseEnv(envFileContent);

console.log("envObj ==>", envObj);
console.log("envObj.PORT ==>", envObj.PORT);
