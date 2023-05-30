import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsEmail,
  Allow,
} from 'class-validator';

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  //   @Allow()
  description: string;
}
