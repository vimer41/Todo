import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatFiltersInterface } from './interfaces/stat.filters.interface';
import { Prisma } from '@prisma/client';
import { diff } from 'node:util';
import { StatMetricsInterface } from './interfaces/stat.metrics.interface';

@Injectable()
export class StatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStat(filters: StatFiltersInterface): Promise<StatMetricsInterface> {
    try {
      const { userId, from, to } = filters;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (from) {
        startDate = new Date(from);
      }

      if (to) {
        endDate = new Date(to);
      }

      if (startDate && endDate && endDate < startDate) {
        throw new BadRequestException(
          'end date must be less than or equal to endDate',
        );
      }

      const where: Prisma.TaskWhereInput = {};
      if (userId) {
        where.userId = userId;
      }

      if (startDate || endDate) {
        where.created_at = {};
        if (startDate) {
          where.created_at.gte = startDate;
        }

        if (endDate) {
          where.created_at.lt = endDate;
        }
      }

      const totalCreatedTasks = await this.prismaService.task.count({ where });

      const whereCompleted: Prisma.TaskWhereInput = {
        ...where,
        completed: true,
      };

      const totalCompletedTasks = await this.prismaService.task.count({
        where: whereCompleted,
      });

      const percentCompletedTasks =
        (totalCompletedTasks / totalCreatedTasks) * 100;

      let totalTimeComplete: number = 0;
      let averageCompleteTime: number = 0;
      const completedTask = await this.prismaService.task.findMany({
        where: whereCompleted,
        select: {
          completed_at: true,
          created_at: true,
        },
      });

      if (completedTask.length > 0) {
        for (let i = 0; i < completedTask.length; i++) {
          let diff: number = 0;
          const task = completedTask[i];
          if (task.completed_at && task.created_at) {
            const diff =
              task.completed_at.getTime() - task.created_at.getTime();
            if (diff > 0) {
              totalTimeComplete += diff;
            }
          }
          totalTimeComplete += Number(diff);
        }
      }
      averageCompleteTime = totalTimeComplete / totalCompletedTasks;
      return {
        totalCreatedTasks,
        totalCompletedTasks,
        percentCompletedTasks,
        averageCompleteTasks: {
          ms: averageCompleteTime,
        },
        period: {
          from,
          to,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
