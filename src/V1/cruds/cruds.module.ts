import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { TeamsModule } from './profiles/teams/teams.module'
import { ProfilesTypesModule } from './profiles-types/profiles-types.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ProfilesModule, 
    TeamsModule,
    ProfilesTypesModule,
    RolesModule,
    EventsModule,
    ScheduleModule,
    UsersModule
  ],
})
export class CrudsModule {}
