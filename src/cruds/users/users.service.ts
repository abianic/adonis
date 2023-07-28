import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Equal } from 'typeorm';

import { User } from './user.entity';
import { SALT_ROUDNS } from '../../constants';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return await this.userRepository.update(id, {
      refreshToken: updateUserDto.refreshToken,
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.userRepository.find({
      where: {
        email: createUserDto.email,
      },
    });

    if (user.length > 0) throw new BadRequestException(`User already exists`);

    const newUser = this.userRepository.create({
      password: this.hashPassword(createUserDto.password),
      email: createUserDto.email,
      name: createUserDto.name,
      metadata: '{}',
      username: null,
      refreshToken: null,
    });

    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, SALT_ROUDNS);
  }
}
