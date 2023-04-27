import { ApiProperty } from '@nestjs/swagger';
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
export class UpdateProjectImgLocationDto {
  @ApiProperty()
  @IsNumber()
  ProjectKey: number;

  @ApiProperty()
  @IsString()
  ProjectImgCode: string;

  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  ENName?: string;

  @ApiProperty()
  @IsString()
  Note?: string;

  @ApiProperty()
  @IsBoolean()
  IsDisabled: boolean;

  @ApiProperty()
  @IsNumber()
  ProjectRevisionKey?: number;
}
