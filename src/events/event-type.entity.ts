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

@Entity()
export class EventType {
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

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToOne(() => Profile, { nullable: false })
  @JoinColumn({
    name: 'profile',
  })
  profile: Profile;

  @ManyToOne(() => Schedule, { nullable: true })
  @JoinColumn({
    name: 'schedule',
  })
  schedule: Schedule;
}
