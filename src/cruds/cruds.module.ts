import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesTypesModule } from './profiles-types/profiles-types.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ProfilesRbacsModule } from './porfiles-rbacs/profiles-rbacs.module';

@Module({
  imports: [
    ProfilesModule, 
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
    EventsModule,
    ScheduleModule,
    UsersModule
  ],
})
export class CrudsModule {}
