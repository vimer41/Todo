import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


}
