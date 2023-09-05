import { Module } from '@nestjs/common';

import { ProfilesModule } from '../profiles/profiles.module';
import { ProfilesTypesModule } from 'src/profiles-types/profiles-types.module';

import { OrganizationsController } from './organizations.controller';
import { UsersModule } from '../users/users.module';
import { OrganizationsService } from './organizations.service';
import { ProfilesRbacsModule } from '../porfiles-rbacs/profiles-rbacs.module';
import { RolesModule } from '../roles/roles.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { AvailabilitiesModule } from '../availabilities/availabilities.module';

@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
    UsersModule,
    ScheduleModule,
    AvailabilitiesModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [],
})
export class OrganizationsModule {}
