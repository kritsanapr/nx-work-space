import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDetailController } from './project-detail.controller';
import { ProjectDetailService } from './project-detail.service';

describe('ProjectDetailController', () => {
  let controller: ProjectDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDetailController],
      providers: [ProjectDetailService],
    }).compile();

    controller = module.get<ProjectDetailController>(ProjectDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
