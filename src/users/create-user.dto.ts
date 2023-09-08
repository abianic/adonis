import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
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

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    description: `Username`,
    example: 'myusername',
  })
  username: string;
}
