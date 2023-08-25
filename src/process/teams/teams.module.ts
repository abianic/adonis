import { Module } from '@nestjs/common';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/cruds/profiles/profile.entity';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';
import { ProfilesRbacsModule } from 'src/cruds/porfiles-rbacs/profiles-rbacs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    ProfilesTypesModule,
    ProfilesRbacsModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [],
})
export class TeamsModule {}
