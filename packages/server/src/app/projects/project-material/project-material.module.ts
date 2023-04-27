import { Module } from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialController } from './project-material.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProjectMaterialController],
  providers: [ProjectMaterialService, PrismaService],
})
export class ProjectMaterialModule {}
