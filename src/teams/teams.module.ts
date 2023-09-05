import { Module } from '@nestjs/common';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ProfilesTypesModule } from 'src/profiles-types/profiles-types.module';
import { ProfilesRbacsModule } from '../porfiles-rbacs/profiles-rbacs.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    ProfilesModule,
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
