import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dtos/create-availability.dto';
import { UpdateAvailabilityDto } from './dtos/update-availability.dto';
import { equal } from 'joi';
import { Days } from 'src/common/enums/Days';
import { Schedule } from 'src/schedule/schedule.entity';
import { Status } from 'src/common/enums/status';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Availability)
    private entityAvailabilityRepository: Repository<Availability>,
  ) {}

  /**
   * Get all the profiles with pagination
   * @param scheduleId schedule id
   * @returns
   */
  async findAll(scheduleId: number) {
    return this.entityAvailabilityRepository.find({
      where: {
        schedule: Equal(scheduleId),
      },
      relations: {
        schedule: true,
      },
    });
  }

  /**
   * Get one profile by id
   * @param id a profile id
   * @returns Profile
   */
  async findById(id: number): Promise<Availability> {
    return await this.entityAvailabilityRepository.findOne({
      select: {},
      where: { id: id },
      relations: {
        schedule: true,
      },
    });
  }

  /**
   *
   * @param data
   * @returns Availability
   */
  async create(data: CreateAvailabilityDto): Promise<Availability> {
    const { day } = data;
    const { schedule } = data;
    let availability = await this.entityAvailabilityRepository.findOneBy({
      day: day,
      schedule: Equal(schedule.id),
    });
    if (availability)
      throw new BadRequestException(`Availability already exists`);

    const newAvailability = this.entityAvailabilityRepository.create(data);
    return this.entityAvailabilityRepository.save(newAvailability);
  }

  /**
   *
   * @param id a availability id
   * @param changes Objet with the information to edit a  availability
   * @returns Availability
   */
  async update(
    id: number,
    changes: UpdateAvailabilityDto,
  ): Promise<Availability> {
    let availability = null;

    await this.entityAvailabilityRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        availability = this.findById(id);
      })
      .catch((error) => {
        console.error('Error al actualizar:', error);
      });

    return availability;
  }

  /**
   *
   * @param id a availability id
   * @param changes Objet with the information to edit a  availability
   * @returns Availability
   */
  async changeStatus(id: number, changes: any): Promise<Availability> {
    let availability = null;

    await this.entityAvailabilityRepository
      .update(id, changes)
      .then((updatedResult) => {
        console.log('Número de filas afectadas:', updatedResult.affected);
        console.log('registro afectado:', updatedResult.raw);
        console.log(updatedResult.generatedMaps);
        availability = this.findById(id);
      })
      .catch((error) => {
        console.error('Error al actualizar:', error);
      });

    return availability;
  }

  /**
   *
   * @param availability Object with the availability information
   * @returns Availability
   */
  remove(availability: Availability) {
    return this.entityAvailabilityRepository.remove(availability);
  }

  async createBulk(data: any[], schedule: Schedule) {
    console.log('elimina');
    await this.entityAvailabilityRepository.delete({
      schedule: Equal(schedule.id),
    });

    console.log('inserta');
    console.log('data:', data);
    data.map(async (availability) => {
      const status: Status = availability.status
        ? Status.ACTIVE
        : Status.INACTIVE;

      const newAvailability = this.entityAvailabilityRepository.create({
        schedule: schedule,
        status: status,
        beginAt: availability.beginAt ? availability.beginAt : '9:00',
        endAt: availability.endAt ? availability.endAt : '5:00',
        day: availability.day,
      });

      await this.entityAvailabilityRepository.save(newAvailability);
    });

    return data;
  }

  async getBulk(scheduleId: number) {
    const data = await this.entityAvailabilityRepository.find({
      where: {
        schedule: Equal(scheduleId),
      },
      relations: {},
    });

    const statusPerDay = {
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
    };

    const dataPerDay = {
      sundayStartTime: '',
      sundayEndTime: '',
      mondayStartTime: '',
      mondayEndTime: '',
      tuesdayStartTime: '',
      tuesdayEndTime: '',
      wednesdayStartTime: '',
      wednesdayEndTime: '',
      thursdayStartTime: '',
      thursdayEndTime: '',
      fridayStartTime: '',
      fridayEndTime: '',
      saturdayStartTime: '',
      saturdayEndTime: '',
    };

    data.map((availability) => {
      if (availability.day == 'Domingo') {
        statusPerDay.sunday = availability.status == 'active' ? true : false;

        dataPerDay.sundayStartTime = availability.beginAt;
        dataPerDay.sundayEndTime = availability.endAt;
      }

      if (availability.day == 'Lunes') {
        statusPerDay.monday = availability.status == 'active' ? true : false;
        dataPerDay.mondayStartTime = availability.beginAt;
        dataPerDay.mondayEndTime = availability.endAt;
      }

      if (availability.day == 'Martes') {
        statusPerDay.tuesday = availability.status == 'active' ? true : false;
        dataPerDay.tuesdayStartTime = availability.beginAt;
        dataPerDay.tuesdayEndTime = availability.endAt;
      }

      if (availability.day == 'Miércoles') {
        statusPerDay.wednesday = availability.status == 'active' ? true : false;
        dataPerDay.wednesdayStartTime = availability.beginAt;
        dataPerDay.wednesdayEndTime = availability.endAt;
      }

      if (availability.day == 'Jueves') {
        statusPerDay.thursday = availability.status == 'active' ? true : false;
        dataPerDay.thursdayStartTime = availability.beginAt;
        dataPerDay.thursdayEndTime = availability.endAt;
      }

      if (availability.day == 'Viernes') {
        statusPerDay.friday = availability.status == 'active' ? true : false;
        dataPerDay.fridayStartTime = availability.beginAt;
        dataPerDay.fridayEndTime = availability.endAt;
      }

      if (availability.day == 'Sábado') {
        statusPerDay.saturday = availability.status == 'active' ? true : false;
        dataPerDay.saturdayStartTime = availability.beginAt;
        dataPerDay.saturdayEndTime = availability.endAt;
      }
    });

    return {
      dataPerDay,
      statusPerDay,
    };
  }
}
