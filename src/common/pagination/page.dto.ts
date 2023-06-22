import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: `page number for a query`,
    required: false,
  })
  readonly page?: number;
}
