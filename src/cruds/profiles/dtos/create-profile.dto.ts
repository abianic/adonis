import { IsString, IsNotEmpty, IsNumber, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
import { ProfileType } from '../../profiles-types/profile-type.entity';
import { Profile } from '../profile.entity';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @ApiProperty({ description: `profiles's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: `profiles's address` })
  readonly address: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's owner` })
  readonly owner: User;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's type` })
  readonly profileType: ProfileType;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles's parent` })
  readonly parent: Profile;
}