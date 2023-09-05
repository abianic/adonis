import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { EventsModule } from './events/events.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProfilesRbacsModule } from './porfiles-rbacs/profiles-rbacs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesTypesModule } from './profiles-types/profiles-types.module';
import { RolesModule } from './roles/roles.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    AuthModule,
    AvailabilitiesModule,
    EventsModule,
    OrganizationsModule,
    ProfilesRbacsModule,
    ProfilesModule,
    ProfilesTypesModule,
    RolesModule,
    ScheduleModule,
    TeamsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
