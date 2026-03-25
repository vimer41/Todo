import {
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

  async createTask(dto: CreateTaskDto) {
    try {
      const createdTask = await this.prismaService.task.create({
        data: dto,
      });
      return { task_id: createdTask.id };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('User was not created');
    }
  }

  async getOneTask(taskId: string, userId: string) {
    const task = await this.prismaService.task.findFirst({
      where: {
        id: taskId,
        userId: userId
      }
    })
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getAllTasks(limit: number = 1, offset: number = 0, userId: string) {
    try{
      return this.prismaService.task.findMany({
        where: {
          userId: userId
        },
        skip: offset,
        take: limit,
      })
    }
    catch(err) {
      if(err.code === "P2025"){
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async updateTask(taskId: string, userId: string, dto: UpdateTaskDTO){
    const { title, description, completed } = dto;
    try{
      return await this.prismaService.task.update({
        where: {
          id: taskId,
          userId: userId
        },
        data: {
          title,
          description,
          completed,
          completed_at: completed ? new Date() : null,
        }
      })
    } catch(err) {
      if(err.code === "P2025"){
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
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }
}
