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
import { Profile } from 'src/cruds/profiles/profile.entity';

export class UpdateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: `schedule's address` })
  name: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ description: `schedule's owner` })
  user: User;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ description: `schedule's profile` })
  profile: Profile;
}
