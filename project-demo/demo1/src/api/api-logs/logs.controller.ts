import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { LogsService } from './logs.service.js';

@ApiTags('日志')
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get(':id')
  @ApiOperation({ summary: '根据日志 ID 查询日志详情' })
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(+id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '根据用户 ID 查询日志' })
  findByUserId(@Param('userId', ParseIntPipe) id: number) {
    return this.logsService.findByUserId(id);
  }

  @Get('group/:userId')
  @ApiOperation({ summary: '根据用户 ID 查询日志，并按 result 分组统计数量' })
  async findUserLogsByGroup(@Param('userId', ParseIntPipe) id: number) {
    const res = await this.logsService.findUserLogsByGroup(id);

    return res.map((item: any) => {
      const { result, count, ...rest } = item;

      return {
        result,
        count,
        otherInfo: rest,
      };
    });
  }
}
