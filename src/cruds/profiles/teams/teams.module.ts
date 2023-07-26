import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesModule } from '../profiles.module';

import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller'
import { Team } from './team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), ProfilesModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
