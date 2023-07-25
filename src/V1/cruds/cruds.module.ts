import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { TeamsModule } from './profiles/teams/teams.module'
import { ProfilesTypesModule } from './profiles-types/profiles-types.module';

@Module({
  imports: [
    ProfilesModule, 
    TeamsModule,
    ProfilesTypesModule,
  ],
})
export class CrudsModule {}
