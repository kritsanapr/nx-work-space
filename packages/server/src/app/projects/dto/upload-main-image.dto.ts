import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMainImageDto {
  MainImgFileName: string;
  altText?: string;
}
