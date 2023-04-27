import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class CreateProjectPhaseDto extends PartialType(CreateProjectDto) {
  @ApiProperty()
  @IsNumber()
  ProjectKey: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  PhaseNumber: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  IsDelivered?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  FromDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  ToDate?: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  Budget?: number;

  @ApiProperty()
  @IsString()
  Note?: string;

  @ApiProperty()
  @IsString()
  WorkDetail?: string;

  @ApiProperty()
  @IsNumber()
  RecorderKey?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  RecordDT?: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ProjectRevisionKey?: number;
}

// ProjectPhaseKey?: bigint | number
// PhaseNumber: string
// IsDelivered: boolean
// FromDate?: Date | string | null
// ToDate?: Date | string | null
// Budget?: Decimal | DecimalJsLike | number | string | null
// Note?: string | null
// WorkDetail?: string | null
// RecorderKey?: number | null
// RecordDT?: Date | string | null
// Project: ProjectCreateNestedOneWithoutProjectPhaseInput
// ProjectRevision?: ProjectRevisionCreateNestedOneWithoutProjectPhaseInput
// ProjectDeliverPhase?: ProjectDeliverPhaseCreateNestedOneWithoutProjectPhaseInput
// ProjectPhaseDeliver?: ProjectPhaseDeliverCreateNestedManyWithoutProjectPhaseInput
