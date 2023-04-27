import { PartialType } from '@nestjs/swagger';
import { CreateProjectDetailDto } from './create-project-detail.dto';

export class UpdateProjectDetailDto extends PartialType(
  CreateProjectDetailDto,
) {}
