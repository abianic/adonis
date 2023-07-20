import { Module } from '@nestjs/common';

import { OrganizationsModule } from './organizations/organizations.module'

@Module({
  imports: [
    OrganizationsModule
  ],
})
export class ProcessModule {}
