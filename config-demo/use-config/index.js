import config from "config";

// config 库 读取环境变量时 会优先读取 config/default.json 文件中的配置，如果有对应的环境变量，则会覆盖默认配置。

const dbConfig = config.get("db");

console.log("dbConfig ==>", dbConfig);
