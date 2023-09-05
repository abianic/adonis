import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Days } from '../common/enums/Days';
import { Status } from '../common/enums/status';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class Availability {
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

  @ApiProperty({ example: Days.LUNES })
  @Column({
    name: 'day',
    type: 'enum',
    enum: Days,
    nullable: false,
  })
  day: Days;

  @ApiProperty({ example: '08:00:00' })
  @Column({
    name: 'begin_at',
    type: 'time',
    nullable: false,
  })
  beginAt: string;

  @ApiProperty({ example: '19:00:00' })
  @Column({
    name: 'end_at',
    type: 'time',
    nullable: false,
  })
  endAt: string;

  @ApiProperty({ example: Status.ACTIVE })
  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
    nullable: false,
  })
  status: Status;

  @ApiProperty({ example: Schedule, type: () => Schedule })
  @ManyToOne(() => Schedule, { nullable: false })
  @JoinColumn({
    name: 'schedule_id',
  })
  schedule: Schedule;
}
