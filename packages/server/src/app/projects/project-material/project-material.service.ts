import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectMaterialDto } from './dto/create-project-material.dto';
import { UpdateProjectMaterialDto } from './dto/update-project-material.dto';

@Injectable()
export class ProjectMaterialService {
  constructor(private prisma: PrismaService) { }
  async create(createProjectMaterial: Prisma.ProjectMaterialCreateInput) {
    console.log(createProjectMaterial);
    createProjectMaterial.Project = {
      connect: { ProjectKey: BigInt(createProjectMaterial['ProjectKey']) },
    };
    createProjectMaterial.Material = {
      connect: { MaterialKey: BigInt(createProjectMaterial['MaterialKey']) },
    };
    // createProjectMaterial['ProjectKey'] = BigInt(
    //   createProjectMaterial['ProjectKey'],
    // );
    createProjectMaterial['Qty'] = Number(createProjectMaterial['Qty']);
    createProjectMaterial['TestQty'] = Number(createProjectMaterial['TestQty']);
    createProjectMaterial['MaterialKey'] = BigInt(
      createProjectMaterial['MaterialKey'],
    );
    createProjectMaterial['RecordUserKey'] = BigInt(
      createProjectMaterial['RecordUserKey'],
    );
    createProjectMaterial['UpdateUserKey'] = BigInt(
      createProjectMaterial['UpdateUserKey'],
    );
    console.log('createProjectMaterial', createProjectMaterial);
    delete createProjectMaterial['ProjectKey'];
    delete createProjectMaterial['MaterialKey'];
    try {
      const data = await this.prisma.projectMaterial.create({
        data: createProjectMaterial,
        include: {
          Material: true,
        },
      });
      console.log(data);
      return this.prisma.toJson(data);
    } catch (err) {
      console.log('Error', err);
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.projectMaterial.findMany({
        include: {
          Material: true,
        },
      });
      return this.prisma.toJson(data);
    } catch (error) {
      console.log(error);
    }
  }

  async findProjectMatAllByID(projectKey: number) {
    const data = await this.prisma.projectMaterial.findMany({
      where: {
        ProjectKey: BigInt(projectKey),
      },
    });
    return this.prisma.toJson(data);
  }

  findOne(id: number) {
    return `This action returns a #${id} projectMaterial`;
  }

  update(id: number, updateProjectMaterialDto: UpdateProjectMaterialDto) {
    return `This action updates a #${id} projectMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectMaterial`;
  }
}
