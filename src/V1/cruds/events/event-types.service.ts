import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { paginate } from 'src/common/pagination/paginate';

import { EventType } from './event-type.entity';
import { CreateEventTypeDto } from './dtos/create-event-type.dto';
import { Profile } from '../profiles/profile.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(data: CreateEventTypeDto): Promise<EventType> {
    let eventType = await this.eventTypeRepository.findOne({
      where: {
        slug: data.slug,
      },
    });

    if (eventType) throw new BadRequestException(`slug already exists`);

    console.log('data:', data);
    const user = new User();
    user.id = data.user.id;

    const profile = await this.profileRepository.findOne({
      where: {
        owner: user,
      },
    });

    console.log('profile:', profile);

    const newEventType = this.eventTypeRepository.create({
      ...data,
      profile: profile,
    });
    return this.eventTypeRepository.save(newEventType);
  }

  async find({ limit, page, search, orderBy, sortedBy }, userId) {
    if (!page) page = 1;
    if (!limit) limit = 30;
    if (!search) search = '';
    if (!orderBy) orderBy = '';
    if (!sortedBy) sortedBy = 'ASC';
    const startIndex = (page - 1) * limit;

    let condition = {};

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        if (key === 'userId') {
          userId = value;
          if (value === 'null' || value === '') userId = null;
        }
      }
    }

    if (userId != null) {
      // condition['user'] = Equal(userId);
    }

    let sortObject = {};
    if (orderBy && sortedBy) {
      sortObject[orderBy] = sortedBy;
    }

    let data = await this.eventTypeRepository.find({
      where: condition,
      // relations: ['user'],
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.eventTypeRepository.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  update(id: number, data: CreateEventTypeDto) {
    // this.eventTypeRepository.update(id, data);
    // return this.prisma.todo.update({
    //   where: {
    //     id,
    //   },
    //   data: todo,
    // });
  }
}
