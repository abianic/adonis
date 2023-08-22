import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: `User email`,
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    description: `User password`,
    example: 'MySecurePassword',
  })
  @IsNotEmpty()
  readonly password?: string;
}
