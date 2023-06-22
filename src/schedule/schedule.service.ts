import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(data: CreateScheduleDto) {
    const newSchedule = this.scheduleRepository.create(data);
    return this.scheduleRepository.save(newSchedule);
  }
}
