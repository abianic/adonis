import * as bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { SALT_ROUDNS } from '../constants';

export class SignUpUserDto {
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @Transform((transform) => {
    return bcrypt.hashSync(transform.value as string, SALT_ROUDNS);
  })
  readonly password?: string;
}
