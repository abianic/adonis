import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { User } from 'src/users/user.entity';
import { Profile } from 'src/profiles/profile.entity';
import { AvailabilitiesService } from '../availabilities/availabilities.service';
import { Days } from 'src/common/enums/Days';
import { CreateAvailabilityDto } from 'src/availabilities/dtos/create-availability.dto';
import { EventTypesService } from '../events/event-types.service';
import { Status } from 'src/common/enums/status';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private entityScheduleRepository: Repository<Schedule>,
    private availabilitiesService: AvailabilitiesService,
    private eventTypesService: EventTypesService,
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
        availabilities: true,
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
      where: { id: id },
      relations: {
        owner: true,
        profile: true,
        availabilities: true,
      },
    });
  }

  /**
   *
   * @param data
   * @returns Schedule
   */
  async create(data: CreateScheduleDto, user: User): Promise<Schedule> {
    let profile: Profile = null;
    if (!data.profileId) {
      profile = new Profile();
      profile.id = user.profileId;
    } else {
      profile = new Profile();
      profile.id = data.profileId;
    }

    let dataCount = await this.entityScheduleRepository.count({
      where: { profile: Equal(data.profileId) },
    });

    const isDefault = dataCount > 0 ? false : true;

    const newSchedule = this.entityScheduleRepository.create({
      name: data.name,
      profile: profile,
      owner: user,
      isDefault: isDefault,
    });
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

    await this.entityScheduleRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        schedule = this.findById(id);
      })
      .catch((error) => {
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

    await this.entityScheduleRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        schedule = this.findById(id);
      })
      .catch((error) => {
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

  async getUserSchedules(profileId: number) {
    return await this.entityScheduleRepository.find({
      where: {
        profile: Equal(profileId),
        status: Status.ACTIVE,
      },
    });
  }

  async createBulk(data: CreateScheduleDto, user: User): Promise<Schedule> {
    let profile: Profile = null;
    if (!data.profileId) {
      profile = new Profile();
      profile.id = user.profileId;
    } else {
      profile = new Profile();
      profile.id = data.profileId;
    }

    let dataCount = await this.entityScheduleRepository.count({
      where: { profile: Equal(data.profileId) },
    });

    console.log('dataCount:', dataCount);

    const isDefault = dataCount > 0 ? false : true;

    const newSchedule = this.entityScheduleRepository.create({
      name: data.name,
      profile: profile,
      owner: user,
      isDefault: isDefault,
    });

    const savedSchedule = await this.entityScheduleRepository.save(newSchedule);

    const days = Object.values(Days);
    for (const day of days) {
      let availabilityDto = new CreateAvailabilityDto();
      availabilityDto.day = day;
      availabilityDto.beginAt = '08:00:00';
      availabilityDto.endAt = '18:00:00';
      availabilityDto.schedule = savedSchedule;

      await this.availabilitiesService.create(availabilityDto);
    }

    return savedSchedule;
  }

  async inactive(id: number) {
    // Validar que no sea default
    const scheduleToDelete = await this.entityScheduleRepository.findOne({
      select: {},
      where: { id: id },
      relations: {
        profile: true,
      },
    });

    console.log('scheduleToDelete:', scheduleToDelete);

    if (scheduleToDelete.isDefault) {
      throw new BadRequestException('Cant delete a default schedule');
    }

    const defaultSchedule = await this.entityScheduleRepository.findOne({
      select: {},
      where: {
        profile: Equal(scheduleToDelete.profile.id),
        isDefault: true,
        status: Status.ACTIVE,
      },
      relations: {},
    });

    // setear todos los event types con el default o con el default del creador

    await this.eventTypesService.updateAny(
      { schedule: Equal(id) },
      {
        schedule: defaultSchedule,
      },
    );

    scheduleToDelete.status = Status.INACTIVE;
    console.log('save');
    return this.entityScheduleRepository.save(scheduleToDelete);
  }
}
