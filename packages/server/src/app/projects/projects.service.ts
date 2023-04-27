import {
  BadRequestException,
  ConfigurableModuleBuilder,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import GetProjectDto from './dto/get-projects.dto';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient, Prisma, Project, ProjectDeliver } from '@prisma/client';
import {
  UpdateProjectStatusDto,
  CreateChecklistDto,
  CreateProjectChecklistDto,
  updateProjectChecklist,
} from './dto/update-project-status.dto';
import { FilterProjectDto } from './dto/filter-project.dto';
import { fileAttachDto } from './dto/get-fileAttach.dto';
import { ConfigModule } from '@nestjs/config';
import { CreateProjectPhaseDto } from './dto/upload-phase.dto';
import { UpdateMainImageDto } from './dto/upload-main-image.dto';
import { CreateProjectActionPictureDto } from './project-detail/dto/create-project-action-picture.dto';
import { CreateCheckDisqualificationDto } from './dto/create-qualification.dto';

type CreateProjectPhase = {
  data: Array<{
    ProjectKey: bigint;
    PhaseNumber: string;
    Budget: number;
    IsDelivered: boolean;
  }>;
};

type UpdateMainImageTpye = {
  MainImgFileName: string;
};
@Injectable({})
export class ProjectsService {
  CreateBudget(CreateProjectBudget: Prisma.ProjectBudgetCreateManyInput[]) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  sortArrayByNullKey(arr: any[], key: string, ascending = true) {
    return arr.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === null && valB === null) {
        return 0;
      }

      if (valA === null) {
        return ascending ? 1 : -1;
      }

      if (valB === null) {
        return ascending ? -1 : 1;
      }

      if (ascending) {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }

  async create(createProjectDto: { project: any; budget: any[] }) {
    const projects = Array.isArray(createProjectDto.project)
      ? createProjectDto.project
      : [createProjectDto.project];

    const transformedProjects = projects.map((e) => {
      return {
        ...e,
        SubdistrictKey: BigInt(e.SubdistrictKey),
        DistrictKey: BigInt(e.DistrictKey),
        ProvinceKey: BigInt(e.ProvinceKey),
      };
    });

    const createProject = await this.prisma.project.create({
      data: transformedProjects[0],
    });
    const data: any = createProject;
    // data['ProjectKey'] = data.ProjectKey.toString();
    if (data.ProjectKey) {
      const budgetData = createProjectDto.budget.map((e) => {
        return { ProjectKey: BigInt(data.ProjectKey), ...e };
      });
      await this.prisma.projectBudget.createMany({
        data: budgetData,
        skipDuplicates: true,
      });
    }

    return {
      status: 'OK',
      data: this.prisma.toJson(createProject),
    };
  }

  async findAllProject(
    limit = '10',
    myCursor: string,
    userRole: string,
    userKey: string,
    skip: string,
    filterOptions,
  ): Promise<{ data: object; count: number }> {
    const {
      search,
      provinceKey,
      projectEn,
      ownerType,
      budgetYear,
      contractorKey,
      status,
      cursor,
    } = filterOptions;

    const tranYears =
      budgetYear !== undefined
        ? Array.isArray(budgetYear)
          ? budgetYear.map((year) => parseInt(year))
          : BigInt(budgetYear)
        : undefined;

    const tranProvince =
      provinceKey !== undefined
        ? Array.isArray(provinceKey)
          ? provinceKey.map((province) => BigInt(province))
          : BigInt(provinceKey)
        : undefined;

    const filterCondition = {
      AND: [],
    };

    if (search?.length > 0) {
      filterCondition.AND.push({
        Name: {
          contains: search,
        },
      });
    }

    if (budgetYear?.length > 0) {
      filterCondition.AND.push({ YearKey: { in: tranYears } });
    }

    if (provinceKey?.length > 0) {
      filterCondition.AND.push({ ProvinceKey: { in: tranProvince } });
    }

    if (projectEn?.length > 0) {
      filterCondition.AND.push({
        ProjectEngineerName: {
          contains: projectEn,
        },
      });
    }

    if (ownerType?.length > 0) {
      filterCondition.AND.push({ OwnerTypeKey: Number(ownerType) });
    }

    if (status?.length > 0) {
      filterCondition.AND.push({ ProjectSKey: Number(status) });
    }

    if (contractorKey?.length > 0) {
      filterCondition.AND.push({ ContractorKey: Number(contractorKey) });
    }

    if (userRole == 'supervisor' || userRole == 'committee') {
      const [dataProjectCommittee, dataProjectSupervisor] = await Promise.all([
        this.prisma.projectCommittee.findMany({
          where: {
            UserKey: BigInt(userKey),
          },
        }),
        this.prisma.projectSupervisor.findMany({
          where: {
            UserKey: BigInt(userKey),
          },
        }),
      ]);

      const projectKeyList = dataProjectCommittee
        .map((committee) => committee.ProjectKey)
        .concat(
          dataProjectSupervisor.map((supervisor) => supervisor.ProjectKey),
        );

      const projectList = await this.prisma.project.findMany({
        where: {
          OR: [
            filterCondition,
            {
              ProjectKey: {
                in: projectKeyList,
              },
            },
            {
              ProjectEngineerKey: {
                equals: BigInt(userKey),
              },
            },
          ],
        },
        take: parseInt(limit),
        cursor: myCursor
          ? {
              ProjectKey: parseInt(myCursor),
            }
          : undefined,
        skip: myCursor ? 1 : undefined,
        include: {
          ProjectChecklist: true,
          ProjectBudget: true,
          ProjectCommittee: true,
          ProjectExtSupervisor: true,
          ProjectImgLocations: true,
          ProjectModification: true,
          ProjectDeliver: true,
          ProjectDProgress: true,
          ProjectMPlan: true,
          ProjectPhase: true,
          ProjectSupervisor: true,
          ProjectTask: true,
          ProjectUser: true,
          ProjectWProgress: true,
          Department: true,
          Subdistrict: true,
          District: true,
          Contractor: true,
          // Province: true,
        },
      });

      const sortData = this.sortArrayByNullKey(
        projectList,
        'ContractDate',
        false,
      );

      const count = await this.prisma.project.count({
        where: {
          OR: [
            filterCondition,
            {
              ProjectKey: {
                in: projectKeyList,
              },
            },
            {
              ProjectEngineerKey: {
                equals: BigInt(userKey),
              },
            },
          ],
        },
      });
      return {
        data: this.prisma.toJson(sortData),
        count,
      };
    } else {
      const cursor = {};
      if (cursor) {
        Object.assign(cursor, { ProjectKey: cursor });
      }
      const data = await this.prisma.project.findMany({
        where: filterCondition,
        take: parseInt(limit),
        cursor: myCursor
          ? {
              ProjectKey: parseInt(myCursor),
            }
          : undefined,
        skip: myCursor ? 1 : undefined,
        orderBy: {
          ContractDate: 'desc',
        },
        include: {
          ProjectChecklist: true,
          ProjectBudget: true,
          ProjectCommittee: true,
          ProjectExtSupervisor: true,
          ProjectImgLocations: true,
          ProjectModification: true,
          ProjectDeliver: true,
          ProjectDProgress: true,
          ProjectMPlan: true,
          ProjectPhase: true,
          ProjectSupervisor: true,
          ProjectTask: true,
          ProjectUser: true,
          ProjectWProgress: true,
          Department: true,
          Subdistrict: true,
          District: true,
          Contractor: true,
          // Province: true,
        },
      });
      const sortData = this.sortArrayByNullKey(data, 'ContractDate', false);
      const count = await this.prisma.project.count({ where: filterCondition });

      return {
        data: this.prisma.toJson(sortData),
        count,
      };
    }
  }

  async findProjectById(
    ProjectKey: string,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.project.findFirst({
      where: { ProjectKey: BigInt(ProjectKey) },
      include: {
        ProjectChecklist: true,
        ProjectBudget: true,
        ProjectCommittee: true,
        ProjectExtSupervisor: true,
        ProjectImgLocations: true,
        ProjectModification: true,
        ProjectDeliver: true,
        ProjectDProgress: true,
        ProjectMPlan: true,
        ProjectPhase: true,
        ProjectSupervisor: true,
        ProjectTask: true,
        ProjectUser: true,
        ProjectWProgress: true,
        Department: true,
        Subdistrict: true,
        District: true,
        Province: true,
        Contractor: true,
      },
    });
    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  async findProjectByUserId(id: string, role: string) {
    if (role == 'commitee') {
      const foundProjectCommittee = await this.prisma.projectCommittee.findMany(
        {
          where: { UserKey: BigInt(id) },
          include: {
            Project: {
              select: {
                ProjectKey: true,
                Name: true,
                StartDT: true,
                EndDT: true,
                OwnerName: true,
                ContractCode: true,
              },
            },
          },
        },
      );
      return {
        role: role,
        length: foundProjectCommittee.length,
        status: foundProjectCommittee.length === 0 ? 'not found' : 'OK',
        data: this.prisma.toJson(foundProjectCommittee),
      };
    } else if (role == 'supervisor') {
      const foundProjectExtSupervisor =
        await this.prisma.projectSupervisor.findMany({
          where: { UserKey: BigInt(id) },
          include: {
            Project: {
              select: {
                Name: true,
                StartDT: true,
                EndDT: true,
                OwnerKey: true,
                ContractCode: true,
              },
            },
          },
        });
      return {
        role: role,
        length: foundProjectExtSupervisor.length,
        status: foundProjectExtSupervisor.length === 0 ? 'not found' : 'OK',
        data: this.prisma.toJson(foundProjectExtSupervisor),
      };
    }
  }

  async findProjectByIdToEdit(ProjectKey: string): Promise<Project> {
    const data = await this.prisma.project.findFirst({
      where: { ProjectKey: BigInt(ProjectKey) },
      include: {
        // Year: true,
        ProjectChecklist: true,
        // ProjectBlackList: true,
        ProjectBudget: true,
        ProjectCommittee: {
          orderBy: {
            UserKey: 'asc',
          },
        },
        Contractor: true,
        ProjectExtSupervisor: {
          orderBy: {
            LineNum: 'asc',
          },
        },
        ProjectImgLocations: true,
        ProjectModification: true,
        ProjectDeliver: {
          include: {
            ProjectDeliverBudget: true,
          },
        },
        ProjectDProgress: {
          include: {
            ProjectDProgTask: {
              include: { ProjectTask: true },
            },
            ProjectDProgMach: {
              include: { Machine: true },
            },
            ProjectDProgMan: {
              include: {
                Man: true,
              },
            },
          },
        },
        ProjectMPlan: true,
        ProjectPhase: true,
        ProjectSupervisor: {
          orderBy: {
            UserKey: 'asc',
          },
        },
        ProjectTask: true,
        ProjectUser: true,
        ProjectWProgress: true,
        Department: true,
        Subdistrict: true,
        District: true,
        Province: true,
      },
    });
    const projectKey = data.ProjectBudget.map((Budget) => Budget.ProjectKey);
    const ProjectDeliverBudget = await this.prisma.projectDeliver.findMany({
      where: {
        ProjectKey: {
          in: projectKey,
        },
      },
      include: {
        ProjectDeliverBudget: true,
      },
    });
    data['ProjectDeliverBudget'] = ProjectDeliverBudget;
    const committeeUserKeys = data.ProjectCommittee.map(
      (committee) => committee.UserKey,
    ).filter((e) => e !== null);
    const projectSupervisorUserKeys = data.ProjectSupervisor.map(
      (supervisor) => supervisor.UserKey,
    ).filter((e) => e !== null);
    const userData = await this.prisma.user.findMany({
      where: {
        UserKey: { in: committeeUserKeys },
      },
      include: {
        Title: true,
        Position: true,
      },
    });

    const supervisorData = await this.prisma.user.findMany({
      where: {
        UserKey: { in: projectSupervisorUserKeys },
      },
      include: {
        Title: true,
        Position: true,
      },
    });

    const extSupervisorData = await this.prisma.user.findMany({
      where: {
        UserKey: { in: projectSupervisorUserKeys },
      },
      include: {
        Title: true,
        Position: true,
      },
    });

    const referenceXData = await this.prisma.referenceX.findMany();
    const referenceXObject = {};
    referenceXData.forEach((ref) => {
      if (!(ref.EnumClassName in referenceXObject)) {
        referenceXObject[ref.EnumClassName] = {};
      }
      referenceXObject[ref.EnumClassName][ref.ReferenceKey] = {
        THTHText: ref.THTHText,
        ENUSText: ref.ENUSText,
      };
    });

    // data.ProjectCommittee = data.ProjectCommittee.sort((a, b) => {
    //   return a.UserKey - b.UserKey;
    // });
    // data.ProjectSupervisor = data.ProjectSupervisor.sort((a, b) => {
    //   return a.UserKey - b.UserKey;
    // });
    // data.ProjectExtSupervisor = data.ProjectExtSupervisor.sort((a, b) => {
    //   return a.LineNum - b.LineNum;
    // });

    const ProjectCommitteeRoleType = data.ProjectCommittee.map(
      (committee) =>
        referenceXObject['CommitteeRoleType'][committee.CommitteeRoleTypeKey],
    );
    const ProjectExtSupervisorRoleType = data.ProjectExtSupervisor.map(
      (projectExtSupervisor) =>
        referenceXObject['ExtSupervisor'][
          projectExtSupervisor.SupervisorRoleTypeKey
        ],
    );
    // userData.sort((a, b) => {
    //   return a.UserKey - b.UserKey;
    // });
    // supervisorData.sort((a, b) => {
    //   return a.UserKey - b.UserKey;
    // });
    // extSupervisorData.sort((a, b) => {
    //   return a.UserKey - b.UserKey;
    // });
    data['CommitteeRole'] = ProjectCommitteeRoleType;
    data['committeeList'] = userData;
    data['ExtSupervisorRole'] = ProjectExtSupervisorRoleType;
    data['supervisorList'] = supervisorData;
    // return this.prisma.toJson(userData) as Project;
    const projectDeliverID = data.ProjectDeliver.map(
      (d) => d.ProjectDeliverKey,
    );
    const projectDeliver = await this.prisma.projectDeliverBudget.findMany({
      where: {
        ProjectDeliverKey: {
          in: projectDeliverID,
        },
      },
    });
    data['deliver'] = projectDeliver;
    return this.prisma.toJson(data) as Project;
  }

  async findProjectTaskById(ProjectKey: string): Promise<{ data: object }> {
    const data = await this.prisma.projectTask.findMany({
      where: { ProjectKey: BigInt(ProjectKey) },
    });
    return {
      data: this.prisma.toJson(data),
    };
  }
  async findProjectMPlanById(
    ProjectKey: string,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.projectMPlan.findMany({
      where: { ProjectKey: BigInt(ProjectKey) },
    });
    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  async findProjectStatusByKey(
    projectStatus: bigint,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.referenceX.findFirst({
      where: {
        ReferenceKey: { equals: projectStatus },
        EnumClassName: 'ProjectStatus',
      },
    });
    // console.log('sprojectSkey ', projectStatus, data);
    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  async findProjectBudgetById(
    ProjectKey: string,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.project.findFirst({
      where: { ProjectKey: BigInt(ProjectKey) },
      select: {
        TotalBudget: true,
        EndDT: true,
        StartDT: true,
      },
    });
    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  async findProjectDetailById(
    ProjectKey: string,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.project.findFirst({
      where: { ProjectKey: BigInt(ProjectKey) },
    });

    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  async searchByName(name: string, field: string) {
    let tableName: any;
    if (field.includes('ผู้ออกแบบ')) {
      tableName = this.prisma.organization;
    } else if (field.includes('ผู้ว่าจ้าง')) {
      tableName = this.prisma.organization;
    } else if (field.includes('ผู้รับจ้าง')) {
      tableName = this.prisma.contractor;
    }
    const data = await tableName.findMany({
      where: {
        OR: [
          {
            Name: {
              contains: name,
            },
          },
        ],
      },
    });
    return {
      mag: 'OK',
      data: this.prisma.toJson(data),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const updateProject = await this.prisma.project.update({
      where: { ProjectKey: id },
      data: updateProjectDto,
    });

    return this.prisma.toJson(updateProject);
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async getProjectStatus() {
    return await this.prisma.referenceX.findMany({
      where: {
        EnumClassName: 'ProjectStatus',
      },
      select: {
        ReferenceKey: true,
        EnumClassName: true,
        EnumItemName: true,
        THTHText: true,
      },
    });
    // const result = await this.prisma
    //   .$queryRaw`SELECT ReferenceKey, EnumClassName FROM ReferenceX WHERE EnumClassName = 'ProjectStatus'`;

    // return result;
  }

  async updateProjectStatus(
    ProjectKey: number,
    updateStatus: UpdateProjectStatusDto,
  ): Promise<{ status: string; data: object }> {
    const projectDetail = await this.prisma.project.update({
      where: { ProjectKey: ProjectKey },
      data: updateStatus,
    });
    return {
      status: 'OK',
      data: this.prisma.toJson(projectDetail),
    };
  }

  // GET ProjectChecklist
  async getProjectChecklist(limit = '20') {
    const data = await this.prisma.projectChecklist.findMany({
      take: parseInt(limit),
      orderBy: {
        ProjectKey: 'asc',
      },
    });
    return {
      data: this.prisma.toJson(data),
    };
  }
  // GET ProjectChecklistByID
  async getProjectChecklistByID(id: string) {
    const projectChecklist = await this.prisma.projectChecklist.findMany({
      where: { ProjectKey: BigInt(id) },
      include: {
        CheckList: {
          select: {
            Code: true,
            Name: true,
            ENName: true,
            Note: true,
            IsDisabled: true,
            CreatorKey: true,
            CreateDT: true,
            UpdaterKey: true,
            UpdateDT: true,
          },
        },
      },
    });
    return {
      // status: 'OK',
      data: this.prisma.toJson(projectChecklist),
    };
  }
  // GET Checklist
  async getChecklist(limit = '50') {
    const data = await this.prisma.checkList.findMany({
      take: parseInt(limit),
      orderBy: {
        CheckListKey: 'asc',
      },
    });
    return {
      data: this.prisma.toJson(data),
    };
  }
  // GET ProjectCheckDetail
  async getProjectCheckDetail(limit = '50') {
    const data = await this.prisma.projCheckDetail.findMany({
      take: parseInt(limit),
      orderBy: {
        ProjCheckDetailKey: 'asc',
      },
    });
    return { data: this.prisma.toJson(data) };
  }
  // GET getProjectCheckTemplate
  async getProjectCheckTemplate(limit = '50') {
    const data = await this.prisma.projCheckTemplate.findMany({
      take: parseInt(limit),
      orderBy: {
        ProjCheckTemplateKey: 'asc',
      },
    });
    return {
      data: this.prisma.toJson(data),
    };
  }

  // GET Project
  async getProjectAll(limit = '10') {
    const Project = await this.prisma.project.findMany({
      take: parseInt(limit),
    });

    const Checklist = await this.prisma.projectChecklist.findMany({
      take: parseInt(limit),
      orderBy: {
        ProjectKey: 'asc',
      },
    });

    const number = Number(limit);
    for (let i = 0; i < number; i++) {
      if ((Project[i].ProjectKey = Checklist[i].ProjectKey)) {
        const newdata = Object.assign(Project[i], {
          ProjectChecklistKey: Checklist[i].ProjectChecklistKey,
          ChecklistKey: Checklist[i].ChecklistKey,
          selected: false,
        });
        Project[i] = newdata;
      }
    }
    const sortData = this.sortArrayByNullKey(Project, 'ContractDate', false);
    return {
      data: this.prisma.toJson(sortData),
    };
  }

  async updateProjectChecklist(id: number, updateProjectChecklist: any) {
    const data2 = await this.prisma.projectChecklist.findMany({
      where: { ProjectKey: parseInt(updateProjectChecklist.ProjectKey) },
    });
    const find: any = data2.find((obj: any) => {
      return obj.ChecklistKey == id;
    });
    if (find.ChecklistKey == id) {
      const updateChecklist = await this.prisma.projectChecklist.update({
        where: { ProjectChecklistKey: find.ProjectChecklistKey },
        data: {
          EmployeePdfFilename: updateProjectChecklist.EmployeePdfFilename,
          DirectorPdfFileName: updateProjectChecklist.DirectorPdfFileName,
          ApprovePdfFileName: updateProjectChecklist.ApprovePdfFileName,
        },
      });
      return this.prisma.toJson(updateChecklist);
    }
  }

  async testUpdateProjectStatus(
    ProjectKey: number,
    updateStatus: UpdateProjectStatusDto,
  ) {
    const projectDetail = await this.prisma.project.update({
      where: { ProjectKey: ProjectKey },
      data: updateStatus,
    });

    // return {
    //   status: 'OK',
    //   data: this.prisma.toJson(projectDetail),
    // };
  }

  async CreateChecklist(CreateChecklistDto: CreateChecklistDto) {
    const CreateChecklist = await this.prisma.checkList.createMany({
      data: CreateChecklistDto,
    });

    return {
      data: this.prisma.toJson(CreateChecklist),
    };
  }

  async CreateProjectChecklist(
    CreateProjectChecklist: CreateProjectChecklistDto,
  ) {
    const ProjectChecklist = await this.prisma.projectChecklist.create({
      data: CreateProjectChecklist,
    });

    return {
      data: this.prisma.toJson(ProjectChecklist),
    };
  }

  async GetfileAttach(limit = '10') {
    const ProjectfileAttach = await this.prisma.fileAttach.findMany({
      take: parseInt(limit),
      orderBy: {
        FileAttachKey: 'desc',
      },
    });

    return {
      data: this.prisma.toJson(ProjectfileAttach),
    };
  }

  async CreateFileAttach(CreatefileAttach: fileAttachDto) {
    // console.log(CreatefileAttach);
    const CreateFileAttach = await this.prisma.fileAttach.create({
      data: CreatefileAttach,
    });

    return {
      data: this.prisma.toJson(CreateFileAttach),
    };
  }
  async CreatePhase(
    CreateProjectPhase: Array<Prisma.ProjectPhaseCreateManyInput>,
  ) {
    const convertData = CreateProjectPhase.map((e) => {
      e.ProjectKey = BigInt(e.ProjectKey);
      return e;
    });
    const ProjectPhase = await this.prisma.projectPhase.createMany({
      data: convertData,
      skipDuplicates: true,
    });
    return {
      data: this.prisma.toJson(ProjectPhase),
    };
  }

  async DeleteChecklist(id: string) {
    const id2 = BigInt(id);
    const DeleteProjectChecklist =
      await this.prisma.projectChecklist.deleteMany({
        where: { ChecklistKey: id2 },
      });
    const DeleteChecklist = await this.prisma.checkList.delete({
      where: { CheckListKey: id2 },
    });
    return {
      data: this.prisma.toJson(DeleteProjectChecklist),
      data2: this.prisma.toJson(DeleteChecklist),
    };
  }

  async Checklist() {
    const Checklist = await this.prisma.checkList.findFirst({
      orderBy: {
        CheckListKey: 'desc',
      },
    });

    return {
      data: this.prisma.toJson(Checklist),
    };
  }

  async getProjectByID(id: any) {
    const Project = await this.prisma.project.findMany({
      where: { ProjectKey: BigInt(id) },
      include: {
        ProjectChecklist: {
          select: {
            ProjectChecklistKey: true,
            ProjectKey: true,
            ChecklistKey: true,
            LineNum: true,
            ProjCheckDetailKey: true,
            EmployeePdfFilename: true,
            DirectorPdfFileName: true,
            ApprovePdfFileName: true,
            ProjectRevisionKey: true,
            CheckList: true,
            ProjCheckDetail: true,
            Project: true,
            ProjectRevision: true,
          },
        },
      },
    });
    return {
      data: this.prisma.toJson(Project),
    };
  }

  async createProjectMPlan(projectMPlanData) {
    // projectMPlanData.DeliverDT = new Date(projectMPlanData.DeliverDT)
    // projectMPlanData.RecordDT = new Date(projectMPlanData.RecordDT)
    // console.log('==>',projectMPlanData);

    const projectMPlan = await this.prisma.projectMPlan.create({
      data: projectMPlanData,
    });
    return {
      data: this.prisma.toJson(projectMPlan),
    };
  }

  async createProjectTask(projectTaskData) {
    // projectMPlanData.DeliverDT = new Date(projectMPlanData.DeliverDT)
    // projectMPlanData.RecordDT = new Date(projectMPlanData.RecordDT)
    console.log('==>', projectTaskData);

    const projectTask = await this.prisma.projectTask.create({
      data: projectTaskData,
    });
    console.log('==>', projectTask);

    return {
      data: this.prisma.toJson(projectTask),
    };
  }

  async getProjectMPlan(projectKey) {
    const projectMplanData = await this.prisma.projectMPlan.findMany({
      where: {
        ProjectKey: BigInt(projectKey),
      },
    });
    return projectMplanData;
  }

  async getProjectTask(projectKey) {
    const projectTask = await this.prisma.projectTask.findMany({
      where: {
        ProjectKey: BigInt(projectKey),
      },
      include: {
        ProjectMPlan: true,
      },
    });
    // check projectMPlan
    let dataProjectMPlanLength = 0;
    projectTask.map((task) => {
      dataProjectMPlanLength += task.ProjectMPlan.length;
    });
    console.log(dataProjectMPlanLength);
    // getProjectMPlan
    if (dataProjectMPlanLength == 0) {
      const projectMPlan = await await this.getProjectMPlan(projectKey);
      console.log(projectMPlan);
      projectTask.map((task) => {
        task.ProjectMPlan = projectMPlan;
      });
      // console.log(projectMPlan);
      // return {
      //   data: this.prisma.toJson(projectTask),
      //   projectMPlanData: projectMPlan
      // };
    }
    return {
      data: this.prisma.toJson(projectTask),
    };
  }
  async getProjectImageLocation(projectKey: string) {
    try {
      const imgLocation = await this.prisma.projectImgLocations.findMany({
        where: { ProjectKey: BigInt(projectKey) },
      });

      return this.prisma.toJson(imgLocation);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createProjectActionPicture(
    projectActionPicture: CreateProjectActionPictureDto,
  ) {
    try {
      const insertActionPicture = await this.prisma.projectDProgImg.create({
        data: projectActionPicture,
      });
      return this.prisma.toJson(insertActionPicture);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async checkDisqualification(
    // disqualification: Prisma.ProjectBlackListCreateInput,
    disqualification: CreateCheckDisqualificationDto,
  ) {
    try {
      console.log(disqualification);

      const createProjectBlacklist = await this.prisma.projectBlackList.create({
        data: {
          ProjectKey: disqualification.ProjectKey,
          ContractorKey: disqualification.ContractorKey,
          IsCondition1True: disqualification.IsCondition1True,
          BlackListMessage1: disqualification.BlackListMessage1,
          IsCondition1BL: disqualification.IsCondition1BL,
          Condition1Note: disqualification.Condition1Note,
          IsCondition2True: disqualification.IsCondition2True,
          BlackListMessage2: disqualification.BlackListMessage2,
          IsCondition2BL: disqualification.IsCondition2BL,
          Condition2Note: disqualification.Condition2Note,
          IsCondition3True: disqualification.IsCondition3True,
          BlackListMessage3: disqualification.BlackListMessage3,
          IsCondition3BL: disqualification.IsCondition3BL,
          Condition3Note: disqualification.Condition3Note,
          IsCondition4True: disqualification.IsCondition4True,
          BlackListMessage4: disqualification.BlackListMessage4,
          IsCondition4BL: disqualification.IsCondition4BL,
          Condition4Note: disqualification.Condition4Note,
          Note: disqualification.Note,
          IsBlackListed: disqualification.IsBlackListed,
          RecorderKey: disqualification.RecorderKey,
          RecordDT: disqualification.RecordDT,
          IsCanceled: disqualification.IsCanceled,
          CancelEmpKey: disqualification.CancelEmpKey,
          CancelDT: disqualification.CancelDT,
          CancelNote: disqualification.CancelNote,
        },
      });

      return this.prisma.toJson(createProjectBlacklist);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findProjectStatusById(
    projectStatus: number,
  ): Promise<{ status: string; data: object }> {
    const data = await this.prisma.referenceX.findFirst({
      where: {
        ReferenceKey: { equals: BigInt(projectStatus) },
        EnumClassName: 'ProjectStatus',
      },
    });
    return {
      status: 'OK',
      data: this.prisma.toJson(data),
    };
  }
}
