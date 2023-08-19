import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { SALT_ROUDNS } from '../../constants';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: `User email`,
    example: 'user@example.com',
  })
  email!: string;

  @IsNotEmpty()
  @Transform((transform) => {
    console.log('transform:', transform);
    return bcrypt.hashSync(transform.value as string, SALT_ROUDNS);
  })
  @ApiProperty({
    description: `User password`,
    example: 'MySecurePassword',
  })
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: `Name`,
    example: 'My Cool Name',
  })
  name: string;
}
