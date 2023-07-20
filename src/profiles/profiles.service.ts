import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { exec } from 'child_process';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Profile } from './profile.entity';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private entityProfile: Repository<Profile>,
  ) {}

  async findAll({ limit, page, search, orderBy, sortedBy }, userId) {
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
      condition['owner'] = Equal(userId);
    }

    let sortObject = {};
    if (orderBy && sortedBy) {
      sortObject[orderBy] = sortedBy;
    }

    let data = await this.entityProfile.find({
      where: condition,
      relations: ['owner'],
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.entityProfile.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  findById(id: number) {
    return this.entityProfile.findOneBy({ id: id});
  }

  async create(data: CreateProfileDto) {
    const { name } = data;

    let profile = await this.entityProfile.findOneBy({ name: name });

    if (profile) throw new BadRequestException(`Profile already exists`);

    const newProfile = this.entityProfile.create(data);
    return await this.entityProfile.save(newProfile);
  }

  async update(id: number, changes: UpdateProfileDto) {
    const profile = await this.entityProfile.update(id, changes);
    if (!profile) {
      throw new NotFoundException(`Profile #${id} not found`);
    }
    return profile;
  }

  remove(profile: Profile) {
    return this.entityProfile.remove(profile);
  }
}
