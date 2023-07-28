import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Schedule } from '../schedule/schedule.entity';
import { Profile } from '../profiles/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EventType {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-07-19T16:51:00.689Z' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ApiProperty({ example: '2023-07-19T16:51:00.689Z' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ApiProperty({ example: 'Quick chat' })
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: '/quick-chat' })
  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug: string;

  @ApiProperty({ example: 'A quick video meeting' })
  @Column({ name: 'description', type: 'text' })
  description: string;

  @ApiProperty({ example: '15' })
  @Column({ name: 'length', type: 'integer' })
  length: number;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Profile, { nullable: false })
  @JoinColumn({
    name: 'profile',
  })
  profile: Profile;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Schedule, { nullable: true })
  @JoinColumn({
    name: 'schedule',
  })
  schedule: Schedule;
}
