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
import { User } from '../../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsNotEmpty()
  @IsObject()
  user: User;
}
