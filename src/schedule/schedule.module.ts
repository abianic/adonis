import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { UsersModule } from '../users/users.module';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AvailabilitiesModule } from '../availabilities/availabilities.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    UsersModule,
    forwardRef(() => AvailabilitiesModule),
    EventsModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
