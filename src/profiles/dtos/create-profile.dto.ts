import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
import { ProfileType } from '../../profiles-types/profile-type.entity';
import { Profile } from '../profile.entity';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @ApiProperty({ description: `profiles's name` })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: `profiles's address` })
  address: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's owner` })
  owner: User;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's type` })
  profileType: ProfileType;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's parent` })
  parent: Profile;

  @IsString()
  @IsOptional()
  @MaxLength(45)
  @ApiProperty({ description: `profiles's slug` })
  slug?: string;
}
