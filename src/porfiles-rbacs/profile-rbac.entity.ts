import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Status } from '../common/enums/status';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';
import { Profile } from '../profiles/profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '../roles/rol.entity';

@Entity()
export class ProfileRbac {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ApiProperty({ example: Status.PENDENTING })
  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.PENDENTING,
    nullable: false,
  })
  status: Status;

  @ApiProperty({ example: User, type: () => User })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ApiProperty({ example: Rol })
  @ManyToOne(() => Rol, { nullable: false })
  @JoinColumn({
    name: 'rol_id',
  })
  rol: Rol;

  @ApiProperty({ example: Profile })
  @ManyToOne(() => Profile, { nullable: false })
  @JoinColumn({
    name: 'profile_id',
  })
  profile: Profile;
}
