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

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  name: string;
}
