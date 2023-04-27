import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async getProjectStatus() {
    const projectStatus = await this.prisma.referenceX.findMany({
      where: {
        EnumClassName: 'ProjectStatus',
      },
    });

    return this.prisma.toJson(projectStatus);
  }
}
