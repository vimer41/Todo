import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    try {
      const createdUser = await this.prismaService.user.create({ data: dto });
      return { id: createdUser.id };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('User was not created');
    }
  }

  async getOneUser(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id: id } });
    if(!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsers(limit: number = 1, offset: number = 0) {
    try{
      return this.prismaService.user.findMany({
        skip: offset,
        take: limit,
      });
    }
    catch(err) {
      if(err.code === "P2025"){
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async updateUser(id: string, dto: CreateUserDto) {
    try{
      return await this.prismaService.user.update({
        where: {
          id: id
        },
        data: dto
      })
    }
    catch(err) {
      if(err.code === "P2025"){
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async deleteUser(id: string) {
    try{
      return await this.prismaService.user.delete({ where: { id: id } });
    }
    catch(err) {
      if(err.code === "P2025") {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }
}
