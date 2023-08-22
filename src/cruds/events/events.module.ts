import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventType } from './event-type.entity';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';
import { Profile } from '../profiles/profile.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventType, Profile, User])],
  controllers: [EventTypesController],
  providers: [EventTypesService],
  exports: [EventTypesService],
})
export class EventsModule {}
