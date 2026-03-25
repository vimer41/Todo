import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
  }), UserModule, TaskModule, StatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
