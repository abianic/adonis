import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsEmail,
  Allow,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: `Event Type Tittle`,
    example: 'Quick chat',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: `Event Type URL`,
    example: '/quick-chat',
  })
  slug: string;

  @IsString()
  @ApiProperty({
    description: `Event Type Description`,
    example: 'A quick video meeting',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    description: `Duration (in minutes)`,
    example: '30',
  })
  length: number;

  @IsOptional()
  @IsObject()
  user: User;

  @IsOptional()
  @IsNumber()
  profileId: number;
}
