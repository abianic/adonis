import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LimitDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: `limit number for a query`, required: false })
  readonly limit: number;
}
