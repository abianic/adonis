import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderByDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: `order by params for a query`, required: false })
  readonly orderBy: string;
}
