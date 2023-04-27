import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProjectActionPictureDto {
  @ApiProperty()
  @IsNumber()
  ProjectDProgressKey;

  @ApiProperty()
  @IsNumber()
  ProjectImgLocationKey;

  @ApiProperty()
  @IsString()
  ImageFileName;

  @ApiProperty()
  @IsNumber()
  ProjectRevisionKey;
}
