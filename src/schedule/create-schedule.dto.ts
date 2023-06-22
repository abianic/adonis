import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsEmail,
  Allow,
  IsObject,
} from 'class-validator';
import { User } from '../users/user.entity';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsObject()
  user: User;
}
