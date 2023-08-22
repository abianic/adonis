import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class PaginationParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: `page number for a query`,
    required: false,
    default: 1,
  })
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(10)
  @ApiProperty({
    description: `limit number for a query`,
    required: false,
    default: 30,
  })
  limit: number = 30;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `order by params for a query`, required: false })
  orderBy: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: `sorted by params for a query`,
    required: false,
    default: 'ASC',
  })
  sortedBy: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ description: `search params for a query`, required: false })
  search: string = '';
}
