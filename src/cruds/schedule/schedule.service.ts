import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { profile } from 'console';
import { UpdateScheduleDto } from './dtos/update-schedule.dto copy';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private entityScheduleRepository: Repository<Schedule>,
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

    let data = await this.entityScheduleRepository.find({
      select: {},
      where: condition,
      relations: {
        owner: true,
        profile: true,
      },
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.entityScheduleRepository.count({
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
  async findById(id: number): Promise<Schedule> {
    return await this.entityScheduleRepository.findOne({
      select: {},
      where: {id: id},
      relations: {
        owner: true,
        profile: true,
      }
    });
  }

  /**
   * 
   * @param data 
   * @returns Schedule
   */
  async create(data: CreateScheduleDto): Promise<Schedule> {
    const { name } = data;
    const { profile } = data;
    let schedule = await this.entityScheduleRepository.findOneBy({
      name: name,
      profile: profile
    });
    if (schedule) throw new BadRequestException(`Schedule already exists`);

    const newSchedule = this.entityScheduleRepository.create(data);
    return this.entityScheduleRepository.save(newSchedule);
  }

  /**
   * 
   * @param id a schedule id
   * @param changes Objet with the information to edit a  schedule
   * @returns Schedule
   */
  async update(id: number, changes: UpdateScheduleDto): Promise<Schedule> {
    let schedule = null;

    await this.entityScheduleRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      schedule = this.findById(id);
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });

    return schedule;
  }

  /**
   * 
   * @param id a schedule id
   * @param changes Objet with the information to edit a  schedule
   * @returns Schedule
   */
  async changeStatus(id: number, changes: any): Promise<Schedule> {
    let schedule = null;

    await this.entityScheduleRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      schedule = this.findById(id);
    }).catch(error => {
      console.error('Error al actualizar:', error);
    });

    return schedule;
  }

  /**
   * 
   * @param schedule Object with the schedule information
   * @returns Schedule
   */
  remove(schedule: Schedule) {
    return this.entityScheduleRepository.remove(schedule);
  }
}
