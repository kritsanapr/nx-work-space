import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  isDate,
  IsDate,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectStatusDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ required: true })
  @IsNumber()
  ProjectSKey: number;

  @ApiProperty()
  @IsString()
  PendingName: string;

  @ApiProperty()
  @IsString()
  Note: string;

  @ApiProperty()
  @IsString()
  CancelNote: string;

  @ApiProperty()
  @IsDate()
  CancelDT: Date;

  @ApiProperty()
  @IsNumber()
  CancelEmpKey: number;

  @ApiProperty()
  @IsDate()
  CompleteDT: Date;

  @ApiProperty()
  @IsString()
  CompleteNote: string;

  @ApiProperty()
  @IsString()
  RecordDT: Date;

  // PendingName;
  // Note: string;
}

//   ProjectSKey: number;
//   PendingName: string;
//   Note: string;
//   CancelNote: string;
//   CancelDT: Date;
//   CancelEmpKey: number;
//   CompleteDT: Date;
//   CompleteNote: string;
//   RecordDT: Date;
export class updateProjectChecklist extends PartialType(CreateProjectDto) {
  // @ApiProperty({ required: true })
  // @IsNumber()
  // ProjectChecklistKey: number;

  @ApiProperty()
  @IsNumber()
  ProjectKey: number;

  @ApiProperty({ required: true })
  @IsNumber()
  ChecklistKey: number;

  // @ApiProperty()
  // @IsString()
  // LineNum: number;

  // @ApiProperty()
  // @IsNumber()
  // ProjCheckDetailKey: number;

  @ApiProperty()
  @IsString()
  EmployeePdfFilename: string;

  @ApiProperty()
  @IsString()
  DirectorPdfFileName: string;

  @ApiProperty()
  @IsString()
  ApprovePdfFileName: string;

  // @ApiProperty()
  // @IsString()
  // ProjectRevisionKey: number;
}

// CreateChecklistDto
export class CreateChecklistDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ required: true })
  @IsNumber()
  CheckListKey: number;

  // @ApiProperty()
  // @IsOptional()
  // CheckListKey?: number;

  @ApiProperty()
  @IsString()
  Code: string;

  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  ENName: string;

  @ApiProperty()
  @IsOptional()
  Note: string | null;

  @ApiProperty()
  @IsString()
  IsDisabled: boolean;

  @ApiProperty()
  @IsNumber()
  CreatorKey: number;

  @ApiProperty()
  @IsDate()
  CreateDT: Date;

  @ApiProperty()
  @IsNumber()
  UpdaterKey: number;

  @ApiProperty()
  @IsDate()
  UpdateDT: Date;

  // @ApiProperty()
  // @IsString()
  // ProjCheckDetail: number;

  // @ApiProperty()
  // @IsString()
  // ProjectChecklist: number;
}

export class CreateProjectChecklistDto {
  @ApiProperty({ required: true })
  @IsNumber()
  ProjectChecklistKey: number;

  @ApiProperty()
  @IsNumber()
  ProjectKey: number;

  @ApiProperty()
  @IsNumber()
  ChecklistKey: number;

  @ApiProperty()
  @IsNumber()
  LineNum: number;

  @ApiProperty()
  @IsNumber()
  ProjCheckDetailKey: number;

  @ApiProperty()
  @IsString()
  EmployeePdfFilename: string;

  @ApiProperty()
  @IsString()
  DirectorPdfFileName: string;

  @ApiProperty()
  @IsString()
  ApprovePdfFileName: string;

  @ApiProperty()
  @IsNumber()
  ProjectRevisionKey: number;

  // "ProjectChecklistKey": 99999,
  // "ProjectKey": 9999,
  // "ChecklistKey": 999,
  // "LineNum": null,
  // "ProjCheckDetailKey": null,
  // "EmployeePdfFilename": "http://localhost:9000/test/fc5fd8ba145d664467788e5256ab90a1.jpg",
  // "DirectorPdfFileName": "",
  // "ApprovePdfFileName": "",
  // "ProjectRevisionKey": null
}
export class deleteChecklistDto {
  @ApiProperty({ required: true })
  @IsNumber()
  CheckListKey: number;

  // @ApiProperty()
  // @IsNumber()
  // Code: string;
}
