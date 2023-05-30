import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventType } from './event-type.entity';
import { CreateEventTypeDto } from './create-event-type.dto';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
  ) {}

  async create(data: CreateEventTypeDto) {
    let eventType = await this.eventTypeRepository.findOne({
      where: {
        slug: data.slug,
      },
    });

    if (eventType) throw new BadRequestException(`slug already exists`);

    const newEventType = this.eventTypeRepository.create(data);
    return this.eventTypeRepository.save(newEventType);
  }
}
