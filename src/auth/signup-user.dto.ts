import * as bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { SALT_ROUDNS } from '../constants';
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
  @Transform((transform) => {
    return bcrypt.hashSync(transform.value as string, SALT_ROUDNS);
  })
  readonly password?: string;
}
