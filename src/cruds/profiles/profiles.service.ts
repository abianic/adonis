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
    private entityProfileRepository: Repository<Profile>,
  ) {}

  /**
   * Get all the profiles with pagination
   * @param param0 
   * @param userId user id
   * @returns 
   */
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

    let data = await this.entityProfileRepository.find({
      where: condition,
      relations: ['owner'],
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.entityProfileRepository.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  /**
   * Get one profile by id
   * @param id a profile id
   * @returns Profile
   */
  findById(id: number) {
    return this.entityProfileRepository.findOneBy({ id: id});
  }

  /**
   * Create a new Profile
   * @param data Objet with the information to create a new profile
   * @returns Profile
   */
  async create(data: CreateProfileDto) {
    const { name } = data;
    console.log(data);
    let profile = await this.entityProfileRepository.findOneBy({ name: name });

    if (profile) throw new BadRequestException(`Profile already exists`);

    const newProfile = this.entityProfileRepository.create(data);
    return await this.entityProfileRepository.save(newProfile);
  }

  /**
   * 
   * @param id a profile id
   * @param changes Objet with the information to edit a  profile
   * @returns Profile
   */
  async update(id: number, changes: UpdateProfileDto) {
    return await this.entityProfileRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      return this.entityProfileRepository.findOneBy({ id: id });
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });
  }

  /**
   * 
   * @param id a profile id
   * @param changes Objet with the information to edit a  profile
   * @returns Profile
   */
  async changeStatus(id: number, changes: any) {
    return await this.entityProfileRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      return this.entityProfileRepository.findOneBy({ id: id });
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });
  }

  /**
   * 
   * @param profile Object with the profile information
   * @returns Profile
   */
  remove(profile: Profile) {
    return this.entityProfileRepository.remove(profile);
  }
}
