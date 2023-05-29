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
import { SALT_ROUDNS } from '../constants';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsNotEmpty()
  @Transform((transform) => {
    console.log('transform:', transform);
    return bcrypt.hashSync(transform.value as string, SALT_ROUDNS);
  })
  readonly password?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
