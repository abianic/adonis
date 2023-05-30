import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventType } from './event-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventType])],
})
export class EventsModule {}
