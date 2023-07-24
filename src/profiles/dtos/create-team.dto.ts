import { IsString, IsNotEmpty, IsEmpty, IsNumber, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../profile.entity';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  @ApiProperty({ description: `teams's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: `teams's address` })
  readonly address: string;
}