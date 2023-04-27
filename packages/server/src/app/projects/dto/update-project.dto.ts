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

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({ required: true })
  @IsString()
  Code: string;

  @ApiProperty({ required: true })
  @IsString()
  Name: string;

  @ApiProperty()
  @IsDate()
  StartDT: Date;

  @ApiProperty()
  @IsDate()
  EndDT: Date;

  @ApiProperty()
  @IsString()
  Note: string;

  @ApiProperty()
  @IsNumber()
  ProjectSKey: number;

  @ApiProperty()
  @IsString()
  ContractCode: string;

  @ApiProperty()
  @IsDate()
  ContractDate: Date;

  @ApiProperty()
  @IsNumber()
  ContractorKey: number;

  @ApiProperty()
  @IsString()
  ContractorName: string;

  @ApiProperty()
  @IsNumber()
  IsExternalProject: number;

  @ApiProperty()
  @IsNumber()
  DepartmentKey: number;

  @ApiProperty()
  @IsNumber()
  OwnerKey: number;

  @ApiProperty()
  @IsString()
  OwnerName: string;

  @ApiProperty()
  @IsString()
  DesignerNote: string;

  @ApiProperty()
  @IsDecimal()
  TotalBudget: any;

  @ApiProperty()
  @IsDecimal()
  FineAmount: any;

  @ApiProperty()
  @IsString()
  ProgressNote: string;

  @ApiProperty()
  @IsNumber()
  RecorderKey: number;

  @ApiProperty()
  @IsDate()
  RecordDT: Date;

  @ApiProperty()
  @IsNumber()
  CompleteEmpKey: number;

  @ApiProperty()
  @IsDate()
  CompleteDT: Date;

  @ApiProperty()
  @IsString()
  CompleteNote: string;

  @ApiProperty()
  @IsNumber()
  CancelEmpKey: number;

  @ApiProperty()
  @IsDate()
  CancelDT: Date;

  @ApiProperty()
  @IsString()
  CancelNote: string;

  @ApiProperty()
  @IsNumber()
  ProjectTypeKey: number;

  @ApiProperty()
  @IsString()
  AddressNote: string;

  @ApiProperty()
  @IsNumber()
  SubdistrictKey: number;

  @ApiProperty()
  @IsNumber()
  DistrictKey: number;

  @ApiProperty()
  @IsNumber()
  ProvinceKey: number;

  @ApiProperty()
  @IsDecimal()
  Latitude: any;

  @ApiProperty()
  @IsDecimal()
  Longtitude: any;

  @ApiProperty()
  @IsString()
  ContractPdfFileName: any;

  @ApiProperty()
  @IsString()
  DrawingPdfFileName: any;

  @ApiProperty()
  @IsNumber()
  YearKey: number;

  @ApiProperty()
  @IsString()
  ExternalProjectNote: string;

  @ApiProperty()
  @IsString()
  PendingName: string;

  @ApiProperty()
  @IsString()
  MainImgFileName: string;

  @ApiProperty()
  @IsNumber()
  OwnerTypeKey: number;

  @ApiProperty()
  @IsDecimal()
  AdvanceAmount: any;

  @ApiProperty()
  @IsString()
  BOQPdfFileName: string;

  @ApiProperty()
  @IsString()
  PhasePdfFileName: string;

  @ApiProperty()
  @IsNumber()
  ProjectEngineerKey: number;

  @ApiProperty()
  @IsString()
  ProjectEngineerNote: string;

  @ApiProperty()
  @IsString()
  ProjectEngineerName: string;

  @ApiProperty()
  @IsNumber()
  ProjectPendingTypeKey: number;

  @ApiProperty()
  @IsDecimal()
  PercentAdvReim: any;

  @ApiProperty()
  @IsDecimal()
  AdvanceAmtBalAftReim: any;

  @ApiProperty()
  @IsDecimal()
  PercentDebAdvance: string;

  @ApiProperty()
  @IsNumber()
  RefProjectKey: number;

  @ApiProperty()
  @IsString()
  InstallmentPdfFileName: any;

  @ApiProperty()
  @IsNumber()
  CommitteeRoleTypeKey: number;

  @ApiProperty()
  @IsNumber()
  longtitude: number;

  @ApiProperty()
  @IsString()
  pendinnote: string;
}
