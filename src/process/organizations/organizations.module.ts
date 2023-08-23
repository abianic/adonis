import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';

import { OrganizationsController } from './organizations.controller';
import { UsersModule } from 'src/cruds/users/users.module';
import { OrganizationsService } from './organizations.service';
import { Profile } from 'src/cruds/profiles/profile.entity';
import { ProfilesRbacsModule } from 'src/cruds/porfiles-rbacs/profiles-rbacs.module';
import { RolesModule } from 'src/cruds/roles/roles.module';

@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
    UsersModule,
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [],
})
export class OrganizationsModule {}
