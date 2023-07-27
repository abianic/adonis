import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventType } from './event-type.entity';
import { EventTypesController } from './event-types.controller';
import { EventTypesService } from './event-types.service';
import { Profile } from '../profiles/profile.entity';


@Module({
  imports: [TypeOrmModule.forFeature([EventType, Profile])],
  controllers: [EventTypesController],
  providers: [EventTypesService],
  exports: [EventTypesService],
})
export class EventsModule {}
