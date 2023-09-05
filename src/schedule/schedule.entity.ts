import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Status } from '../common/enums/status';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';
import { Profile } from '../profiles/profile.entity';
import { Availability } from '../availabilities/availability.entity';

@Entity()
export class Schedule {
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

  @ApiProperty({ example: 'Default' })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: Status.ACTIVE })
  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    nullable: false,
  })
  status: Status;

  @ApiProperty({ example: User, type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  owner: User;

  @ApiProperty({ example: Profile, type: () => Profile })
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({
    name: 'profile_id',
  })
  profile: Profile;

  @ApiProperty({ example: Availability })
  @OneToMany(() => Availability, (Availability) => Availability.schedule)
  availabilities: Availability[];
}
