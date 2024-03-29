import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Equal,
  FindManyOptions,
  ObjectId,
  FindOptionsWhere,
} from 'typeorm';
import { paginate } from 'src/common/pagination/paginate';

import { EventType } from './event-type.entity';
import { CreateEventTypeDto } from './dtos/create-event-type.dto';
import { Profile } from '../profiles/profile.entity';
import { User } from '../users/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private eventTypeRepository: Repository<EventType>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateEventTypeDto): Promise<EventType> {
    const user = new User();
    user.id = data.user.id;
    let profile: Profile = null;

    if (!data.profileId) {
      profile = await this.profileRepository.findOne({
        where: {
          owner: Equal(user.id),
          profileType: Equal(5),
        },
      });
    } else {
      profile = await this.profileRepository.findOne({
        where: {
          id: data.profileId,
        },
      });
    }

    let eventType = await this.eventTypeRepository.findOne({
      where: {
        slug: data.slug,
        profile: Equal(profile.id),
      },
    });

    if (eventType) throw new BadRequestException(`slug already exists`);

    const newEventType = this.eventTypeRepository.create({
      ...data,
      profile: profile,
    });
    return this.eventTypeRepository.save(newEventType);
  }

  async find({ limit, page, search, orderBy, sortedBy }, user: User) {
    const startIndex = (page - 1) * limit;

    let condition = {};

    let userId = user.id || null;

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
    return this.eventTypeRepository.update(id, data);
  }

  findById(id: number) {
    return this.eventTypeRepository.findOneBy({ id: id });
  }

  remove(profile: EventType) {
    return this.eventTypeRepository.remove(profile);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    const profile = await this.profileRepository.findOne({
      where: {
        owner: Equal(user.id),
      },
    });

    const eventTypes = await this.eventTypeRepository.findBy({
      profile: Equal(profile.id),
    });

    console.log(
      '*****************************Backend: eventTypes:',
      eventTypes,
    );

    return {
      name: user?.name,
      eventTypes,
    };
  }

  async findAny(params: FindManyOptions<EventType>) {
    return await this.eventTypeRepository.find(params);
  }

  async updateAny(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<EventType>,
    partialEntity: QueryDeepPartialEntity<EventType>,
  ) {
    return await this.eventTypeRepository.update(criteria, partialEntity);
  }
}
