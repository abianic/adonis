import { Module } from '@nestjs/common';

import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';

import { OrganizationsController } from './organizations.controller';
import { UsersModule } from 'src/cruds/users/users.module';
import { OrganizationsService } from './organizations.service';
import { ProfilesRbacsModule } from 'src/cruds/porfiles-rbacs/profiles-rbacs.module';
import { RolesModule } from 'src/cruds/roles/roles.module';
import { ScheduleModule } from 'src/cruds/schedule/schedule.module';
import { AvailabilitiesModule } from 'src/cruds/availabilities/availabilities.module';

@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
    UsersModule,
    ScheduleModule,
    AvailabilitiesModule
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [],
})
export class OrganizationsModule {}
