import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProjectDetailService } from './project-detail.service';
import { CreateProjectDetailDto } from './dto/create-project-detail.dto';
import { UpdateProjectDetailDto } from './dto/update-project-detail.dto';
import { UpdateProjectImgLocationDto } from './dto/update-project-img-location.dto';
import { CreateProjectImgLocationDto } from './dto/create-project-img-location.dto';

@Controller('project-detail')
export class ProjectDetailController {
  constructor(private readonly projectDetailService: ProjectDetailService) { }

  @Get(':project-budget')
  getProjectBudget(@Param('projectKey') projectKey: number) {
    return this.projectDetailService.getProjectBudget(projectKey);
  }

  @Get(':projectKey')
  getProjectDeliver(@Param('projectKey') projectKey: number) {
    return this.projectDetailService.getProjectDeliver(projectKey);
  }

  @Get('/project-detail/:projectKey')
  getProjectDetail(@Param('projectKey') projectKey: number) {
    return this.projectDetailService.getProjectDetail(+projectKey);
  }

  @Get('/project-img-location/:projectKey')
  getProjectImgLocation(@Param('projectKey') projectKey: number) {
    return this.projectDetailService.getProjectImgLocation(+projectKey);
  }

  @Get('/project-img-location-by-key/:projectImgLocationKey')
  getProjectImgLocationByKey(
    @Param('projectImgLocationKey') projectImgLocationKey: number,
  ) {
    return this.projectDetailService.getProjectImgLocationByKey(
      projectImgLocationKey,
    );
  }

  @Patch('/project-img-location/:imgLocationKey')
  updateProjectImgLocation(
    @Param('imgLocationKey') imgLocationKey: string,
    @Body()
    projectImageLocation: UpdateProjectImgLocationDto,
  ) {
    try {
      console.log({ imgLocationKey });
      return this.projectDetailService.updateProjectImgLocation(
        imgLocationKey,
        projectImageLocation,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/project-img-location')
  createProjectImgLocation(
    @Body() projectImgLocation: CreateProjectImgLocationDto,
  ) {
    console.log(projectImgLocation);
    try {
      return this.projectDetailService.createProjectImgLocation(
        projectImgLocation,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/project-img-location/:projectImgKey')
  deleteProjectImgLocation(@Param('projectImgKey') projectImgKey: string) {
    return this.projectDetailService.deleteProjectImgLocation(projectImgKey);
  }

  @Post()
  create(@Body() createProjectDetailDto: CreateProjectDetailDto) {
    return this.projectDetailService.create(createProjectDetailDto);
  }

  @Get()
  findAll() {
    return this.projectDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDetailDto: UpdateProjectDetailDto,
  ) {
    return this.projectDetailService.update(+id, updateProjectDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDetailService.remove(+id);
  }
}
