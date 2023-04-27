import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import {
  UpdateProjectStatusDto,
  CreateChecklistDto,
  CreateProjectChecklistDto,
  updateProjectChecklist,
} from './dto/update-project-status.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
import { fileAttachDto } from './dto/get-fileAttach.dto';
import { Prisma, Project } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { CreateProjectPhaseDto } from './dto/upload-phase.dto';
import { BudgetPipe } from './pipes/budget.pipe';
import { ProjectTask, ProjectMPlan } from '@prisma/client';
import { UpdateMainImageDto } from './dto/upload-main-image.dto';
import { CreateProjectActionPictureDto } from './project-detail/dto/create-project-action-picture.dto';
import { CreateCheckDisqualificationDto } from './dto/create-qualification.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/project-phase/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer);
    const wsnames = workbook.SheetNames;
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[wsnames[0]]);
    const errorList = [];
    let sorting = true;
    json.forEach((e, i) => {
      if (Number.isNaN(Number(e.งบประมาณ))) {
        errorList.push({
          phase: e.งวด,
          errorType: typeof e.งบประมาณ,
        });
      }
      if (Number(e.งวด) !== i + 1) {
        sorting = false;
      }
    });
    return { errorPhaseList: errorList, phaseSorting: sorting, phase: json };
  }

  /**
   * Function update main image
   */
  @Patch('/project-main-image/:id')
  async updateMainImage(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    console.log({ id, updateProjectDto });

    return this.projectsService.update(+id, updateProjectDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body(BudgetPipe)
    createProjectDto: {
      project: any;
      budget: any[];
    },
  ) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiQuery({
    name: 'limit',
    description: 'The maximum number of query projects',
    required: false,
    type: Number,
  })
  @Get('projects')
  async findAll(
    @Query('limit') limit: string,
    @Query('myCursor') myCursor: string,
    @Query('userKey') userKey: string,
    @Query('userRole') userRole: string,
    @Query('skip') skip: string,
    @Query() filterOptions: FilterProjectDto,
  ): Promise<{ data: object; count: number }> {
    const listProject = await this.projectsService.findAllProject(
      limit,
      myCursor,
      userRole,
      userKey,
      skip,
      filterOptions,
    );

    for (
      let projectNo = 0;
      projectNo < Object.keys(listProject.data).length;
      projectNo++
    ) {
      const projectId = listProject.data[projectNo].ProjectKey;
      const projectMPlan = await this.projectsService.findProjectMPlanById(
        projectId,
      );
      const projectDetail = await this.projectsService.findProjectTaskById(
        projectId,
      );

      let Mplan = 0;
      let Task = 0;
      let listTask = 0;
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear() + 543;

      function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
      }

      for (let i = 0; i < Object.keys(projectMPlan.data).length; i++) {
        const yearKey = Number(projectMPlan.data[i].YearKey);
        const moyKey = Number(projectMPlan.data[i].MoyKey);
        const pct = Number(projectMPlan.data[i].PlanPct);
        if (yearKey < year || (yearKey === year && moyKey < month)) {
          Mplan += pct;
        } else if (yearKey === year && moyKey === month) {
          Mplan += (pct * date.getDate()) / getDaysInMonth(year, month);
        }
      }

      for (let i = 0; i < Object.keys(projectDetail.data).length; i++) {
        Task +=
          Number(projectDetail.data[i].Budget) *
          Number(projectDetail.data[i].WeightPct);
        listTask += 1;
      }
      Task = Number(Task / Number(listProject.data[projectNo]['TotalBudget']));
      console.log(listProject.data[projectNo]['ProjectSKey']);

      console.log(listProject.data['ProjectSKey']);
      const icon_project = await this.projectsService.findProjectStatusByKey(
        BigInt(listProject.data[projectNo]['ProjectSKey']),
      );

      Mplan = Mplan > 100 ? 100 : Mplan;

      listProject.data[projectNo]['detail'] = {
        PercentMplan: Mplan.toFixed(2),
        PercentTask: Task.toFixed(2),
        listTask,
        icon_project,
      };
    }

    return {
      data: listProject.data,
      count: listProject.count,
    };
  }

  @Get('/project-daily/:projectKey')
  async findProjectById(@Param('projectKey') projectId: string) {
    const dailyReportData = await this.projectsService.findProjectById(
      projectId,
    );
    const projectMPlan = await this.projectsService.findProjectMPlanById(
      projectId,
    );
    const projectDetail = await this.projectsService.findProjectTaskById(
      projectId,
    );

    let Mplan = 0;
    let Task = 0;
    let listTask = 0;
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    for (let i = 0; i < Object.keys(projectMPlan.data).length; i++) {
      const yearKey = Number(projectMPlan.data[i].YearKey);
      const moyKey = Number(projectMPlan.data[i].MoyKey);
      const pct = Number(projectMPlan.data[i].PlanPct);
      if (yearKey < year || (yearKey === year && moyKey < month)) {
        Mplan += pct;
      } else if (yearKey === year && moyKey === month) {
        Mplan += (pct * date.getDate()) / getDaysInMonth(year, month);
      }
    }

    for (let i = 0; i < Object.keys(projectDetail.data).length; i++) {
      Task +=
        Number(projectDetail.data[i].Budget) *
        Number(projectDetail.data[i].WeightPct);
      listTask += 1;
    }

    Task = Number(
      (Task / Number(dailyReportData.data['TotalBudget'])).toFixed(2),
    );

    Mplan = Mplan > 100 ? 100 : Mplan;

    const icon_project = await this.projectsService.findProjectStatusByKey(
      dailyReportData.data['ProjectSKey'],
    );

    return {
      status: 'success',
      data: {
        PercentMplan: Mplan.toFixed(2),
        PercentTask: Task.toFixed(2),
        listTask,
        dailyReportData,
        icon_project,
      },
    };
  }

  @Get('/project-detail/:projectKey')
  async findProjectDetailById(@Param('projectKey') projectId: string) {
    const ProjectData = await this.projectsService.findProjectByIdToEdit(
      projectId,
    );

    const projectMPlan = await this.projectsService.findProjectMPlanById(
      projectId,
    );
    const projectDetail = await this.projectsService.findProjectTaskById(
      projectId,
    );

    let Mplan = 0;
    let Task = 0;
    let listTask = 0;
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    for (let i = 0; i < Object.keys(projectMPlan.data).length; i++) {
      const yearKey = Number(projectMPlan.data[i].YearKey);
      const moyKey = Number(projectMPlan.data[i].MoyKey);
      const pct = Number(projectMPlan.data[i].PlanPct);
      if (yearKey < year || (yearKey === year && moyKey < month)) {
        Mplan += pct;
      } else if (yearKey === year && moyKey === month) {
        Mplan += (pct * date.getDate()) / getDaysInMonth(year, month);
      }
    }

    for (let i = 0; i < Object.keys(projectDetail.data).length; i++) {
      Task +=
        Number(projectDetail.data[i].Budget) *
        Number(projectDetail.data[i].WeightPct);
      listTask += 1;
    }
    Task = Number((Task / Number(ProjectData.TotalBudget)).toFixed(2));

    Mplan = Mplan > 100 ? 100 : Mplan;

    ProjectData['PercentMplan'] = Mplan.toFixed(2);
    ProjectData['PercentTask'] = Task.toFixed(2);

    return ProjectData;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }

  @Get('/project-status')
  getProjectStatus() {
    return this.projectsService.getProjectStatus();
  }

  @Patch('/project-status/:id')
  updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProjectStatus: UpdateProjectStatusDto,
  ) {
    return this.projectsService.updateProjectStatus(+id, updateProjectStatus);
  }

  @Get('/project-user/:id/:role')
  async getProjectByUserId(
    @Param('id') id: string,
    @Param('role') role: string,
  ) {
    const ProjectData = await this.projectsService.findProjectByUserId(
      id,
      role,
    );
    return ProjectData;
  }

  @Get('/project-checklist')
  getProjectChecklist() {
    return this.projectsService.getProjectChecklist();
  }

  @Get('/project-checklist/:id')
  getProjectChecklistByID(@Param('id') id: string) {
    return this.projectsService.getProjectChecklistByID(id);
  }

  @Get('/checklist')
  getChecklist() {
    return this.projectsService.getChecklist();
  }

  @Get('/project-CheckDetail')
  getProjectCheckDetail() {
    return this.projectsService.getProjectCheckDetail();
  }

  @Get('/project-checktemplate')
  getProjectCheckTemplate() {
    return this.projectsService.getProjectCheckTemplate();
  }
  @Get('/projectAll')
  getProjectAll() {
    return this.projectsService.getProjectAll();
  }

  @Patch('/project-checklist/:id')
  updateProjectChecklist(
    @Param('id') id: string,
    @Body() updateProjectChecklist: updateProjectChecklist,
  ) {
    return this.projectsService.updateProjectChecklist(
      +id,
      updateProjectChecklist,
    );
  }

  @Get('/project/:id')
  getProjectByID(@Param('id') id: string) {
    return this.projectsService.getProjectByID(id);
  }

  @Patch('/test-Update-status/:id')
  testUpdateProjectStatus(
    @Param('id') id: string,
    @Body() updateProjectStatus: UpdateProjectStatusDto,
  ) {
    return this.projectsService.testUpdateProjectStatus(
      +id,
      updateProjectStatus,
    );
  }

  @Post('/create-checklist')
  CreateChecklist(@Body() CreateChecklist: CreateChecklistDto) {
    return this.projectsService.CreateChecklist(CreateChecklist);
  }

  @Post('/CreateProjectChecklist')
  CreateProjectChecklist(
    @Body() CreateProjectChecklist: CreateProjectChecklistDto,
  ) {
    return this.projectsService.CreateProjectChecklist(CreateProjectChecklist);
  }

  @Get('/fileAttach')
  GetFileAttach() {
    return this.projectsService.GetfileAttach();
  }

  @Post('/create-fileAttach')
  CreateFileAttach(@Body() CreateFileAttach: fileAttachDto) {
    return this.projectsService.CreateFileAttach(CreateFileAttach);
  }
  @Post('/upload-project-phase')
  CreateProjectPhase(
    @Body() CreateProjectPhase: Array<Prisma.ProjectPhaseCreateManyInput>,
  ) {
    return this.projectsService.CreatePhase(CreateProjectPhase);
  }
  @Delete('/CheckList/:id')
  DeleteChecklist(@Param('id') id: string) {
    return this.projectsService.DeleteChecklist(id);
  }

  @Get('/CheckListKey')
  Checklist() {
    return this.projectsService.Checklist();
  }
  // @Post('/create-project-budget')d
  // CreateProjectBudget(
  //   @Body() CreateProjectBudget: Array<Prisma.ProjectBudgetCreateManyInput>,
  // ) {
  //   return this.projectsService.CreateBudget(CreateProjectBudget);
  // }

  @Post('/createProjectMPlan')
  createProjectMPlan(@Body() projectMPlanData: Partial<ProjectMPlan>) {
    return this.projectsService.createProjectMPlan(projectMPlanData);
  }

  @Post('/createProjectTask')
  createProjectTask(@Body() projectTaskData) {
    console.log(projectTaskData);

    // return this.projectsService.createProjectTask(projectTaskData);
  }

  // @Get('/getProjectMPlan/:projectKey')
  // getProjectMPlan(@Param('projectKey')projectKey ){
  //   return this.projectsService.getProjectMPlan(projectKey);
  // }

  @Get('/getProjectTask/:projectKey')
  getProjectTask(@Param('projectKey') projectKey) {
    return this.projectsService.getProjectTask(projectKey);
  }

  /**
   *
   * @return {*}
   * @memberof ProjectsController
   */
  @Post('/project-action-picture')
  createProjectActionPicture(
    projectActionPicture: CreateProjectActionPictureDto,
  ) {
    return this.projectsService.createProjectActionPicture(
      projectActionPicture,
    );
  }

  /**
   * Function for get image location for select label.
   *
   * @param {string} id
   * @return {Json of image location}
   * @memberof ProjectsController
   */
  @Get('/project-action-picture/:id')
  getProjectImgLocation(@Param('id') id: string) {
    return this.projectsService.getProjectImageLocation(id);
  }

  /**
   * API Function for manage check disqualification.
   */
  @Post('/check-disqualification')
  checkDisqualification(@Body() disqualification: any) {
    console.log({ disqualification });
    return this.projectsService.checkDisqualification(disqualification);
  }

  @Get('/check-disqualification/:id')
  async getDisqualification(@Param('id') id: string) {
    const dailyReportData = await this.projectsService.findProjectById(id);
    const projectMPlan = await this.projectsService.findProjectMPlanById(id);
    const projectDetail = await this.projectsService.findProjectTaskById(id);

    let Mplan = 0;
    let Task = 0;
    let listTask = 0;
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;

    function getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    for (let i = 0; i < Object.keys(projectMPlan.data).length; i++) {
      const yearKey = Number(projectMPlan.data[i].YearKey);
      const moyKey = Number(projectMPlan.data[i].MoyKey);
      const pct = Number(projectMPlan.data[i].PlanPct);
      if (yearKey < year || (yearKey === year && moyKey < month)) {
        Mplan += pct;
      } else if (yearKey === year && moyKey === month) {
        Mplan += (pct * date.getDate()) / getDaysInMonth(year, month);
      }
    }

    for (let i = 0; i < Object.keys(projectDetail.data).length; i++) {
      Task +=
        Number(projectDetail.data[i].Budget) *
        Number(projectDetail.data[i].WeightPct);
      listTask += 1;
    }

    Task = Number(
      (Task / Number(dailyReportData.data['TotalBudget'])).toFixed(2),
    );

    Mplan = Mplan > 100 ? 100 : Mplan;

    const icon_project = await this.projectsService.findProjectStatusById(
      dailyReportData.data['ProjectSKey'],
    );

    return {
      status: 'success',
      data: {
        PercentMplan: Mplan.toFixed(2),
        PercentTask: Task.toFixed(2),
        listTask,
        dailyReportData,
        icon_project,
      },
    };
  }
}
