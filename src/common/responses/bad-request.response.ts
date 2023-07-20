import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'slug already exists' })
  message: string;
}
