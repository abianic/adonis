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
import { EventType } from '../events/event-type.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Profile {
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

  @Column({ name: 'name', type: 'varchar', length: 45, nullable: false })
  name: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.PENDENTING,
    nullable: false,
  })
  status: Status;

  @OneToMany(() => EventType, (eventType) => eventType.profile)
  eventTypes: EventType[];

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'owner',
  })
  owner: User;
}
