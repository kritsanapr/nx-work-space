import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckDisqualificationDto {
  @ApiProperty({ required: true })
  @IsNumber()
  ProjectKey: number;

  @ApiProperty({ required: true })
  @IsNumber()
  ContractorKey: number;

  @ApiProperty()
  @IsBoolean()
  IsCondition1True: boolean;

  @ApiProperty()
  @IsString()
  BlackListMessage1: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition1BL: boolean;

  @ApiProperty()
  @IsString()
  Condition1Note: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition2True: boolean;

  @ApiProperty()
  @IsString()
  BlackListMessage2: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition2BL: boolean;

  @ApiProperty()
  @IsString()
  Condition2Note: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition3True: boolean;

  @ApiProperty()
  @IsString()
  BlackListMessage3: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition3BL: boolean;

  @ApiProperty()
  @IsString()
  Condition3Note: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition4True: boolean;

  @ApiProperty()
  @IsString()
  BlackListMessage4: string;

  @ApiProperty()
  @IsBoolean()
  IsCondition4BL: boolean;

  @ApiProperty()
  @IsString()
  Condition4Note: string;

  @ApiProperty()
  @IsString()
  Note: string;

  @ApiProperty()
  IsBlackListed: boolean;

  @ApiProperty()
  @IsNumber()
  RecorderKey: number;

  @ApiProperty()
  @IsDate()
  RecordDT: Date;

  @ApiProperty()
  @IsBoolean()
  IsCanceled: boolean;

  @ApiProperty()
  @IsNumber()
  CancelEmpKey: number;

  @ApiProperty()
  @IsDate()
  CancelDT: Date;

  @ApiProperty()
  @IsString()
  CancelNote: string;
}
