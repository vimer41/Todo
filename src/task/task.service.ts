import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    if (!userId) {
      console.log(userId);
      throw new BadRequestException('User Id is required');
    }
    try {
      const createdTask = await this.prismaService.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          completed: dto.completed,
          completed_at: dto.completed ? new Date() : null,
          userId: userId,
        },
      });
      return { task_id: createdTask.id };
    } catch (err) {
      if (err.code == 'P2003') {
        throw new NotFoundException('User not found');
      } else if (err.code == 'P2007') {
        throw new BadRequestException('Invalid data provided');
      }
      console.log(err);
      throw new InternalServerErrorException('Task was not created');
    }
  }

  async getOneTask(taskId: string, userId: string) {
    const task = await this.prismaService.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getAllTasks(limit: number = 20, offset: number = 0, userId: string) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        userId: userId,
      },
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'asc',
      },
    });

    const total = await this.prismaService.task.count({ where: { userId } });
    return { tasks: tasks, total };

  }

  async updateTask(taskId: string, userId: string, dto: UpdateTaskDTO) {
    const { title, description, completed } = dto;
    try {
      const updatedTask = await this.prismaService.task.update({
        where: {
          id: taskId,
          userId: userId,
        },
        data: {
          title,
          description,
          completed,
          completed_at: completed ? new Date() : null,
        },
      });
      if (updatedTask) {
        return { success: true };
      }
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw err;
    }
  }

  async deleteTask(taskId: string, userId: string) {
    try {
      return await this.prismaService.task.delete({
        where: { id: taskId, userId: userId },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User or Task not found');
      }
      throw err;
    }
  }
}
