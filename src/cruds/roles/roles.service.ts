import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { paginate } from 'src/common/pagination/paginate';

import { Rol } from './rol.entity';
import { CreateRolDto } from './dtos/create-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  /**
   * 
   * @param CreateRolDto data
   * @return Promise<Rol>
   */
  async create(data: CreateRolDto): Promise<Rol> {
    let rol = await this.rolRepository.findOne({
      where: {
        name: data.name,
      },
    });

    if (rol) throw new BadRequestException(`name already exists`);

    const newRol = this.rolRepository.create(data);
    return this.rolRepository.save(newRol);
  }

  /**
   * @returns Promise<Rol[]>
   */
  async findAll(): Promise<Rol[]> {
    let data = await this.rolRepository.find();

    return data;
  }

  /**
   * Get one rol by id
   * @param id a rol id
   * @returns Promise<Rol>
   */
  findById(id: number): Promise<Rol> {
    return this.rolRepository.findOneBy({ id: id});
  }

  /**
   * Get one rol by id
   * @param name a rol id
   * @returns Promise<Rol>
   */
  findByName(name: string): Promise<Rol> {
    return this.rolRepository.findOneBy({ name: name});
  }
}
