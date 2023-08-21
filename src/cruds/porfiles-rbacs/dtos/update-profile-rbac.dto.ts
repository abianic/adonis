import { IsString, IsNotEmpty, IsNumber, MaxLength, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
import { Rol } from 'src/cruds/roles/rol.entity';
import { Profile } from 'src/cruds/profiles/profile.entity';


export class UpdateProfileRbacDto {
  @IsString()
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles-rbac's user` })
  user: User;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles-rbac's rol` })
  rol: Rol;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: `profiles-rbacs's profile` })
  profile: Profile;
}