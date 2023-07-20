import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Team } from './team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Team])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
