import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import * as yaml from 'js-yaml';
import _ from 'lodash';

// 方法一：直接使用

// const YAML_CONFIG_FILENAME = 'config.yaml';

// const FILE_PATH = join(import.meta.dirname, '../config', YAML_CONFIG_FILENAME);

// // 因为 ConfigModule 的 load 方法需要一个 函数返回配置对象，所以这里导出一个函数。
// export default () => {
//   return yaml.load(readFileSync(FILE_PATH, 'utf8')) as Record<string, any>;
// };

// 方法二：结合默认配置使用

const DEFAULT_YAML_CONFIG_FILENAME = 'config.yaml';

const DEFAULT_FILE_PATH = join(
  import.meta.dirname,
  '../config',
  DEFAULT_YAML_CONFIG_FILENAME,
);

const defaultConfig = yaml.load(
  readFileSync(DEFAULT_FILE_PATH, 'utf8'),
) as Record<string, any>;

const YAML_CONFIG_FILENAME = `config.${process.env.NODE_ENV || 'development'}.yaml`;

const FILE_PATH = join(import.meta.dirname, '../config', YAML_CONFIG_FILENAME);

const envConfig = yaml.load(readFileSync(FILE_PATH, 'utf8')) as Record<
  string,
  any
>;

// 因为 ConfigModule 的 load 方法需要一个 函数返回配置对象，所以这里导出一个函数。
export default () => {
  return _.merge(defaultConfig, envConfig);
};
