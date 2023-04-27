import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectDetailDto } from './dto/create-project-detail.dto';
import { UpdateProjectDetailDto } from './dto/update-project-detail.dto';
import { PrismaClient, Prisma, Project } from '@prisma/client';
import { UpdateProjectImgLocationDto } from './dto/update-project-img-location.dto';
import { CreateProjectImgLocationDto } from './dto/create-project-img-location.dto';
@Injectable()
export class ProjectDetailService {
  constructor(private prisma: PrismaService) { }

  async getProjectBudget(projectKey: number) {
    return await this.prisma.projectBudget.findMany({
      where: {
        ProjectKey: projectKey,
      },
    });
  }

  async getProjectDeliver(projectKey: number) {
    const projectDeliver = await this.prisma.projectDeliver.findMany({
      where: {
        ProjectKey: Number(projectKey),
      },
      include: {
        ProjectDeliverBudget: true,
      },
    });

    // console.log(projectDeliver);

    return this.prisma.toJson(projectDeliver);
  }

  async getProjectDetail(projectKey: number): Promise<Project> {
    const data = await this.prisma.project.findFirst({
      where: { ProjectKey: projectKey },
      include: {
        ProjectChecklist: true,
        ProjectCommittee: {
          orderBy: {
            UserKey: 'asc',
          },
        },
        ProjectExtSupervisor: {
          orderBy: {
            LineNum: 'asc',
          },
        },
        ProjectImgLocations: true,
        ProjectModification: true,
        ProjectBudget: true,
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

    // const projectBudgetKey = data.ProjectBudget.map(
    //   (Budget) => Budget.ProjectKey,
    // );
    // const ProjectDeliverBudget = await this.prisma.projectDeliver.findMany({
    //   where: {
    //     ProjectKey: {
    //       in: projectBudgetKey,
    //     },
    //   },
    //   include: {
    //     ProjectDeliverBudget: true,
    //   },
    // });
    // data['ProjectDeliverBudget'] = ProjectDeliverBudget;

    const committeeUserKeys = data.ProjectCommittee.map(
      (committee) => committee.UserKey,
    ).filter((e) => e !== null);

    const userData = await this.prisma.user.findMany({
      where: {
        UserKey: { in: committeeUserKeys },
      },
      include: {
        Title: true,
        Position: true,
      },
      orderBy: {
        UserId: 'asc',
      },
    });

    const projectSupervisorUserKeys = data.ProjectSupervisor.map(
      (supervisor) => supervisor.UserKey,
    ).filter((e) => e !== null);

    const supervisorData = await this.prisma.user.findMany({
      where: {
        UserKey: { in: projectSupervisorUserKeys },
      },
      include: {
        Title: true,
        Position: true,
      },
      orderBy: {
        UserId: 'asc',
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
      orderBy: {
        UserId: 'asc',
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

    // const projectDeliverID = data.ProjectDeliver.map(
    //   (d) => d.ProjectDeliverKey,
    // );
    // const projectDeliver = await this.prisma.projectDeliverBudget.findMany({
    //   where: {
    //     ProjectDeliverKey: {
    //       in: projectDeliverID,
    //     },
    //   },
    // });
    // data['deliver'] = projectDeliver;
    return this.prisma.toJson(data) as Project;
  }

  async getProjectImgLocation(projectKey: number) {
    const projectImageLocation = await this.prisma.projectImgLocations.findMany(
      {
        where: {
          ProjectKey: projectKey,
        },
      },
    );

    return this.prisma.toJson(projectImageLocation);
  }

  async getProjectImgLocationByKey(
    projectImgLocationKey: number,
  ): Promise<any> {
    const projectLocation = await this.prisma.projectImgLocations.findFirst({
      where: {
        ProjectImgLocationsKey: BigInt(projectImgLocationKey),
      },
    });

    return this.prisma.toJson(projectLocation);
  }

  /**
   * Function update Project Image location.
   * params : imgLocationKey<number>, projectImgLocation<object>
   * Table : ProjectImgLocations
   * Return array
   * @param {number} imgLocationKey
   * @param {UpdateProjectImgLocationDto} projectImgLocation
   * @return {*}
   * @memberof ProjectDetailService
   */
  async updateProjectImgLocation(
    imgLocationKey: string,
    projectImgLocation: UpdateProjectImgLocationDto,
  ) {
    try {
      const { ProjectImgCode, Name, ENName, Note, IsDisabled } =
        projectImgLocation;

      console.log({ imgLocationKey });
      console.log(projectImgLocation);

      const updateProjectImgLocation =
        await this.prisma.projectImgLocations.update({
          where: {
            ProjectImgLocationsKey: BigInt(imgLocationKey),
          },
          data: {
            Name: Name,
            Note: Note,
            ENName: ENName,
            ProjectImgCode: ProjectImgCode,
            IsDisabled: !!IsDisabled,
          },
        });

      console.log(updateProjectImgLocation);

      return this.prisma.toJson(updateProjectImgLocation);
    } catch (error) {
      throw new Error(
        `Failed to update project image location: ${error.message}`,
      );
    }
  }

  /**
   * Function create Project Image location.
   * Table : ProjectImgLocations
   * Return array
   * @param {CreateProjectImgLocationDto} projectImgLocation
   * @return {*}
   * @memberof ProjectDetailService
   */
  async createProjectImgLocation(
    projectImgLocation: CreateProjectImgLocationDto,
  ) {
    const {
      ProjectKey,
      ProjectImgCode,
      Name,
      ENName,
      Note,
      IsDisabled,
      ProjectRevisionKey,
    } = projectImgLocation;
    const createProjectImgLocation =
      await this.prisma.projectImgLocations.create({
        data: {
          ProjectKey: BigInt(ProjectKey),
          ProjectImgCode: ProjectImgCode,
          Name: Name,
          ENName: ENName,
          Note: Note,
          IsDisabled: !!IsDisabled,
          ProjectRevisionKey: ProjectRevisionKey,
        },
      });

    return this.prisma.toJson(createProjectImgLocation);
  }

  /**
   *
   *
   * @param {number} projectImgKey
   * @return {*}
   * @memberof ProjectDetailService
   */
  async deleteProjectImgLocation(projectImgKey: string) {
    try {
      console.log(projectImgKey);

      const deleteImgLocation = await this.prisma.projectImgLocations.delete({
        where: {
          ProjectImgLocationsKey: BigInt(projectImgKey),
        },
      });

      return this.prisma.toJson(deleteImgLocation);
    } catch (error) {
      throw new Error(
        `Failed to delete project image location: ${error.message}`,
      );
    }
  }

  create(createProjectDetailDto: CreateProjectDetailDto) {
    return 'This action adds a new projectDetail';
  }

  findAll() {
    return `This action returns all projectDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectDetail`;
  }

  update(id: number, updateProjectDetailDto: UpdateProjectDetailDto) {
    return `This action updates a #${id} projectDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectDetail`;
  }
}
