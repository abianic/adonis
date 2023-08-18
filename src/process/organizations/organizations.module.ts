import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';

import { OrganizationsController } from './organizations.controller';
import { UsersModule } from 'src/cruds/users/users.module';


@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule,
    UsersModule
  ],
  controllers: [OrganizationsController],
  providers: [],
  exports: [],
})
export class OrganizationsModule {}
