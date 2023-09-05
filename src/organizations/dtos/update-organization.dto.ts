import { IsString, IsNotEmpty, IsNumber, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
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
}