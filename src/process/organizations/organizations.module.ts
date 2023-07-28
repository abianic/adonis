import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';

import { OrganizationsController } from './organizations.controller';


@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule
  ],
  controllers: [OrganizationsController],
  providers: [],
  exports: [],
})
export class OrganizationsModule {}
