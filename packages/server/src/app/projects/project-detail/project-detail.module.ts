import { Module } from '@nestjs/common';
import { ProjectDetailService } from './project-detail.service';
import { ProjectDetailController } from './project-detail.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProjectDetailController],
  providers: [ProjectDetailService, PrismaService],
})
export class ProjectDetailModule {}
