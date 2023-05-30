import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { Team } from './team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Team])],
})
export class OrganizationsModule {}
