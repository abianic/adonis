import { Module } from '@nestjs/common';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';
import { ProfilesRbacsModule } from 'src/cruds/porfiles-rbacs/profiles-rbacs.module';
import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { RolesModule } from 'src/cruds/roles/roles.module';

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
