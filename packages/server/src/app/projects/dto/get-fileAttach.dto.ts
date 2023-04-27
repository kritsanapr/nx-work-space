import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class fileAttachDto {
  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsNumber()
  MediaTypeKey: number;

  @ApiProperty()
  @IsString()
  FolderName: string | null;

  @ApiProperty()
  @IsString()
  SubfolderName: string | null;

  @ApiProperty()
  @IsString()
  Thumbnail: string | null;

  @ApiProperty()
  @IsString()
  RecordDT: Date | null;

  @ApiProperty()
  @IsString()
  TableName: string | null;

  @ApiProperty()
  @IsNumber()
  DataKey: number | null;

  @ApiProperty()
  @IsString()
  MimeType: string;

  @ApiProperty()
  @IsNumber()
  FileSize: number;

  @ApiProperty()
  @IsString()
  FileGuid: string;
}
