import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { exec } from 'child_process';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Team } from './team.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { Profile } from './profile.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private entityTeamRepository: Repository<Team>,
  ) {}

  /**
   * Get all the teams with pagination
   * @param param0 
   * @param profileId profile id
   * @returns 
   */
  async findAll({ limit, page, search, orderBy, sortedBy }, profileId) {
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
        if (key === 'profileId') {
          profileId = value;
          if (value === 'null' || value === '') profileId = null;
        }
      }
    }

    if (profileId != null) {
      condition['organization'] = Equal(profileId);
    }

    let sortObject = {};
    if (orderBy && sortedBy) {
      sortObject[orderBy] = sortedBy;
    }

    let data = await this.entityTeamRepository.find({
      where: condition,
      relations: ['organization'],
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.entityTeamRepository.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  /**
   * Get one team by id
   * @param id a team id
   * @param organizationId a profile id
   * @returns Team
   */
  async findById(id: number, organizationId: number) {
    return await this.entityTeamRepository.findOne({
      relations: ['organization'],
      where: { 
        id: id,
        organization: Equal(organizationId),
      },
    });
  }

  /**
   * Create a new Team
   * @param data Objet with the information to create a new team
   * @param organization a profile object
   * @returns Team
   */
  async create(data: CreateTeamDto, organazation: Profile) {
    const { name } = data;

    let team = await this.entityTeamRepository.findOneBy({ name: name });

    if (team) throw new BadRequestException(`Team already exists`);

    const newTeam = this.entityTeamRepository.create({...data, organization: organazation});
    return await this.entityTeamRepository.save(newTeam);
  }

  /**
   * 
   * @param id a team id
   * @param organizationId a profile id
   * @param changes Objet with the information to edit a  team
   * @returns Team
   */
  async update(id: number, organizationId: number, changes: UpdateTeamDto) {
    return await this.entityTeamRepository.update({ 
      id: id,
      organization: Equal(organizationId),
    }, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      return this.entityTeamRepository.findOneBy({ id: id });
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });
  }

  /**
   * 
   * @param id a team id
   * @param organizationId a profile id
   * @param changes Objet with the information to edit a  team
   * @returns Team
   */
  async changeStatus(id: number, organizationId: number, changes: any) {
    return await this.entityTeamRepository.update({ 
      id: id,
      organization: Equal(organizationId),
    }, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      return this.entityTeamRepository.findOneBy({ id: id });
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });
  }

  /**
   * 
   * @param team Object with the team information
   * @returns Team
   */
  remove(team: Team) {
    return this.entityTeamRepository.remove(team);
  }
}
