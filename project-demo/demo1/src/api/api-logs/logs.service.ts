import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLogDto } from './dto/create-log.dto.js';
import { UpdateLogDto } from './dto/update-log.dto.js';

import { Logs } from './entities/logs.entity.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createLogDto: CreateLogDto) {
    return 'This action adds a new log';
  }

  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: number) {
    return this.logsRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: number) {
    // 只有当你需要先判断用户是否存在，然后再去查日志时（比如：如果用户不存在，你希望抛出一个 NotFoundException，而不是返回一个空数组），
    // 你才需要先 findOneBy 查一下 User。如果只是单纯拉取日志列表，直接查 Log 表就足够了！

    // const user = await this.userRepository.findOneBy({ id: userId });

    // if (!user) {
    //   return {
    //     data: null,
    //   };
    // }

    // return this.logsRepository.find({
    //   where: { user: { id: user.id } },
    //   // relations: {
    //   //   user: true, // 关联查询
    //   // },
    // });

    return this.logsRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true, // 关联查询
      },
    });
  }

  async findUserLogsByGroup(userId: number) {
    // 1. 统计每个 result 的数量，并返回数量最多的 result

    // return await this.logsRepository
    //   .createQueryBuilder('logs')
    //   .select('logs.result', 'result')
    //   .addSelect('COUNT("logs.resoult")', 'count')
    //   .addSelect('ANY_VALUE(logs.path)', 'path') //
    //   .leftJoinAndSelect('logs.user', 'user')
    //   // .innerJoin('logs.user', 'user') // 只用于过滤条件，不查 user 的具体字段
    //   .where('user.id = :id', { id: userId })
    //   .groupBy('logs.result')
    //   .orderBy('count', 'DESC') // 倒序排列
    //   // .offset(1) // 分页查询
    //   .limit(1)
    //   .getRawMany();

    // 2. 根据 result 结果数量 和 path 进行分组，统计每个 result 的数量，并返回数量最多的 result 及其对应的 path

    // 原生SQL:
    // SELECT
    //     logs.result AS result,
    //     logs.path AS path,
    //     COUNT(logs.result) AS count
    // FROM logs
    // INNER JOIN user ON logs.userId = user.id
    // WHERE user.id = ?
    // GROUP BY logs.result, logs.path
    // ORDER BY count DESC
    // LIMIT 1;
    // return await this.logsRepository
    //   .createQueryBuilder('logs')
    //   .select('logs.result', 'result')
    //   .addSelect('logs.path', 'path') // 👈 增加了返回的列
    //   .addSelect('COUNT("logs.result")', 'count')
    //   .innerJoin('logs.user', 'user') // 优化：不需要查 user 字段的话，用 innerJoin 即可
    //   .where('user.id = :id', { id: userId })
    //   .groupBy('logs.result')
    //   .addGroupBy('logs.path') // 👈 关键：必须加入分组
    //   .orderBy('count', 'DESC')
    //   // .limit(10)
    //   .getRawMany();

    // 3. 使用原生 SQL 查询（不推荐，除非你熟悉 SQL 并且有特殊需求）
    const sql = `
      SELECT 
        logs.result AS result, 
        logs.path AS path, 
        COUNT(logs.result) AS count 
      FROM logs 
      INNER JOIN user ON logs.userId = user.id 
      WHERE user.id = ? 
      GROUP BY logs.result, logs.path 
      ORDER BY count DESC 
    `;

    // 传入 SQL 和参数数组，TypeORM 会帮你安全地替换掉 ? 占位符，千万不要用模板字符串 ${userId} 直接拼进去，否则会有 SQL 注入风险，且类型转换容易出错。
    // this.logsRepository.query() 返回的是纯数组 Array<any>，里面的 count 如果数据库驱动没做类型转换，可能会是字符串（比如 "15" 而不是 15），前端处理时可能需要 Number(item.count)。
    return await this.logsRepository.query(sql, [userId]);
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
