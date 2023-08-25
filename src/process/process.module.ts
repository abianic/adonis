import { Module } from '@nestjs/common';

import { OrganizationsModule } from './organizations/organizations.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [OrganizationsModule, TeamsModule],
})
export class ProcessModule {}
