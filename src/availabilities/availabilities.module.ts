import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './availability.entity';
import { AvailabilitiesService } from './availabilities.service'
import { AvailabilitiesController } from './availabilities.controller'
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Availability]), ScheduleModule],
  controllers: [AvailabilitiesController],
  providers: [AvailabilitiesService],
  exports: [AvailabilitiesService]
})
export class AvailabilitiesModule {}
