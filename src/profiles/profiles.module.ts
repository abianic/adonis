import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Team } from './team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Team])],
})
export class ProfilesModule {}
