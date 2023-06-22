import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SortedByDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: `sorted by params for a query`, required: false })
  readonly sortedBy: string;
}
