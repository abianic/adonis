import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

import { paginate } from 'src/common/pagination/paginate';

import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dtos/create-availability.dto';
import { UpdateAvailabilityDto } from './dtos/update-availability.dto';
import { equal } from 'joi';

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
        schedule: Equal(scheduleId)
      },
      relations: {
        schedule: true
      }
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
      where: {id: id},
      relations: {
        schedule: true
      }
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
      schedule: schedule
    });
    if (availability) throw new BadRequestException(`Availability already exists`);

    const newAvailability = this.entityAvailabilityRepository.create(data);
    return this.entityAvailabilityRepository.save(newAvailability);
  }

  /**
   * 
   * @param id a availability id
   * @param changes Objet with the information to edit a  availability
   * @returns Availability
   */
  async update(id: number, changes: UpdateAvailabilityDto): Promise<Availability> {
    let availability = null;

    await this.entityAvailabilityRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      availability = this.findById(id);
    }).catch(error => {
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

    await this.entityAvailabilityRepository.update(id, changes).then(updatedResult => {
      console.log('Número de filas afectadas:', updatedResult.affected); 
      console.log('registro afectado:', updatedResult.raw);
      console.log(updatedResult.generatedMaps);
      availability = this.findById(id);
    }).catch(error => {
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
}
