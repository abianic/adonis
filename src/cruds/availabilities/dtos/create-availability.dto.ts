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
import { Schedule } from 'src/cruds/schedule/schedule.entity';
import { Days } from 'src/common/enums/Days';

export class CreateAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({ description: `availability's day` })
  day: Days;

  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  @ApiProperty({ description: `availability's time begin` })
  beginAt: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  @ApiProperty({ description: `availability's time end` })
  endAt: string;

  @IsOptional()
  @IsObject()
  schedule: Schedule;
}
