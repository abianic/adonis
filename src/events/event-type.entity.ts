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
import { User } from '../users/user.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Team } from '../organizations/team.entity';

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

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'user',
  })
  user: User;

  @ManyToOne(() => Schedule, { nullable: true })
  @JoinColumn({
    name: 'schedule',
  })
  schedule: Schedule;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({
    name: 'team',
  })
  team: Team;
}
