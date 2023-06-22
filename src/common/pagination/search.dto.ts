import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: `search params for a query`, required: false })
  readonly search: string;
}
