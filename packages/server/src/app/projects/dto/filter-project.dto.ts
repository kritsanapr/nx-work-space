import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({
    type: [Number],
  })
  @IsOptional()
  @IsString()
  provinceKey: Array<number>;

  @ApiPropertyOptional({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  budgetYear: Array<number>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectEn: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  status: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  contractorKey: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  projectType: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  ownerType: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cursor: number;
}
