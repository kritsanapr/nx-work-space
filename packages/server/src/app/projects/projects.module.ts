import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../prisma.service';
import { ProjectDetailModule } from './project-detail/project-detail.module';
import { ProjectMaterialModule } from './project-material/project-material.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
  imports: [ProjectDetailModule, ProjectMaterialModule],
})
export class ProjectsModule {}
