import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch, Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getUsersPage(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.userService.getAllUsers(limit, offset);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: CreateUserDto) {
    await this.userService.updateUser(id, dto);
    return { success: true };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return;
  }
}
