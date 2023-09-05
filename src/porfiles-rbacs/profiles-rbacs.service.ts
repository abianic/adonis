import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { exec } from 'child_process';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindManyOptions } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';
import { Profile } from '../profiles/profile.entity';
import { CreateProfileRbacDto } from './dtos/create-profile-rbac.dto';
import { UpdateProfileRbacDto } from './dtos/update-profile-rbac.dto';
import { ProfileRbac } from './profile-rbac.entity';
import { Status } from 'src/common/enums/status';

@Injectable()
export class ProfilesRbacsService {
  constructor(
    @InjectRepository(ProfileRbac)
    private entityProfileRbacRepository: Repository<ProfileRbac>,
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
      condition['user'] = Equal(userId);
    }

    let sortObject = {};
    if (orderBy && sortedBy) {
      sortObject[orderBy] = sortedBy;
    }

    let data = await this.entityProfileRbacRepository.find({
      select: {},
      where: condition,
      relations: {
        user: true,
        rol: true,
        profile: true,
      },
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.entityProfileRbacRepository.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  /**
   * Get one ProfileRbac by id
   * @param id a ProfileRbac id
   * @returns ProfileRbac
   */
  async findById(id: number): Promise<ProfileRbac> {
    return await this.entityProfileRbacRepository.findOne({
      select: {},
      where: { id: id },
      relations: {
        user: true,
        rol: true,
        profile: true,
      },
    });
  }

  /**
   * Create a new ProfileRbac
   * @param data Objet with the information to create a new profile
   * @returns ProfileRbac
   */
  async create(data: CreateProfileRbacDto) {
    console.log(data);
    let profileRbac = await this.entityProfileRbacRepository.findOneBy({
      user: data.user,
      rol: data.rol,
      profile: data.profile,
    });

    if (profileRbac) throw new BadRequestException(`Profile already exists`);

    const newProfileRbac = this.entityProfileRbacRepository.create({
      ...data,
      status: Status.ACTIVE,
    });
    return await this.entityProfileRbacRepository.save(newProfileRbac);
  }

  /**
   *
   * @param id a ProfileRbac id
   * @param changes Objet with the information to edit a  profile
   * @returns ProfileRbac
   */
  async update(id: number, changes: UpdateProfileRbacDto) {
    return await this.entityProfileRbacRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        return this.findById(id);
      })
      .catch((error) => {
        console.error('Error al actualizar:', error);
      });
  }

  /**
   *
   * @param id a ProfileRbac id
   * @param changes Objet with the information to edit a  profile
   * @returns ProfileRbac
   */
  async changeStatus(id: number, changes: any) {
    return await this.entityProfileRbacRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        return this.findById(id);
      })
      .catch((error) => {
        console.error('Error al actualizar:', error);
      });
  }

  /**
   *
   * @param profileRbac Object with the profile information
   * @returns ProfileRbac
   */
  remove(profileRbac: ProfileRbac) {
    return this.entityProfileRbacRepository.remove(profileRbac);
  }

  async findByUserId(id: number): Promise<ProfileRbac[]> {
    return await this.entityProfileRbacRepository.find({
      select: {},
      where: { user: Equal(id) },
      relations: {
        profile: true,
      },
    });
  }

  async find(params: FindManyOptions<ProfileRbac>) {
    return await this.entityProfileRbacRepository.find(params);
  }

  async count(params: FindManyOptions<ProfileRbac>) {
    return await this.entityProfileRbacRepository.count(params);
  }

  async updatByCriteria(criteria: any, partialEntity: any) {
    return await this.entityProfileRbacRepository.update(
      criteria,
      partialEntity,
    );
  }
}
