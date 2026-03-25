import { Controller, Get, Query } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatMetricsInterface } from './interfaces/stat.metrics.interface';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get()
  async getStats(
    @Query('userId') userId?: string,  // 👤 Опционально: статистика по другому пользователю (для админов)
    @Query('from') from?: string,      // 📅 Начало периода
    @Query('to') to?: string,          // 📅 Конец периода
  ): Promise<StatMetricsInterface> {

    return this.statService.getStat({
      userId: userId,
      from,
      to,
    });
  }
}
