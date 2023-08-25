import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfileRbac } from '../porfiles-rbacs/profile-rbac.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, ProfileRbac])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
