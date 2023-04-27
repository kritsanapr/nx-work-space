import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { CreateProjectMaterialDto } from './dto/create-project-material.dto';
import { UpdateProjectMaterialDto } from './dto/update-project-material.dto';
import { Prisma } from '@prisma/client';

@Controller('project-material')
export class ProjectMaterialController {
  constructor(
    private readonly projectMaterialService: ProjectMaterialService,
  ) {}

  @Post()
  create(@Body() createProjectMaterialDto: Prisma.ProjectMaterialCreateInput) {
    return this.projectMaterialService.create(createProjectMaterialDto);
  }

  @Get()
  findAll() {
    return this.projectMaterialService.findAll();
  }

  @Get(':projectKey')
  findAllByID(@Param('projectKey') projectKey: string) {
    return this.projectMaterialService.findProjectMatAllByID(+projectKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectMaterialDto: UpdateProjectMaterialDto,
  ) {
    return this.projectMaterialService.update(+id, updateProjectMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectMaterialService.remove(+id);
  }
}
