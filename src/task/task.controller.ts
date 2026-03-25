import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/create')
  async create(@Body() dto: CreateTaskDto, @Query('userId') userId: string) {
    return this.taskService.createTask(userId, dto);
  }

  @Get('/task')
  async getTask(
    @Query('taskId') taskId: string,
    @Query('userId') userId: string,
  ) {
    return this.taskService.getOneTask(taskId, userId);
  }

  @Get('/')
  async getAllTasksUser(
    @Query('userId') userId: string,
    @Query(
      'limit',
      new ParseIntPipe({
        optional: true,
        exceptionFactory: () =>
          new BadRequestException('Limit must be a number'),
      }),
    )
    limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.taskService.getAllTasks(limit, offset, userId);
  }

  @Patch('/update')
  async updateTask(
    @Query('userId') userId: string,
    @Query('taskId') taskId: string,
    @Body() dto: UpdateTaskDTO,
  ) {
    return this.taskService.updateTask(taskId, userId, dto);
  }

  @Delete('delete/')
  async deleteTask(
    @Query('taskId') taskId: string,
    @Query('userId') userId: string,
  ) {
    return this.taskService.deleteTask(taskId, userId);
  }
}
