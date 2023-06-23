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

export class CreateProfileTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name: string;
}
