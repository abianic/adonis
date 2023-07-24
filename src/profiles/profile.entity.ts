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

  @ApiProperty({ example: "Torcauato Studio" })
  @Column({ name: 'name', type: 'varchar', length: 45, nullable: false })
  name: string;

  @ApiProperty({ example: "Martires 28" })
  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @ApiProperty({ example: Status.PENDENTING })
  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.PENDENTING,
    nullable: false,
  })
  status: Status;

  @ApiProperty({ example: EventType })
  @OneToMany(() => EventType, (eventType) => eventType.profile)
  eventTypes: EventType[];

  @ApiProperty({ example: User })
  @OneToOne(() => User, { nullable: false, eager:true })
  @JoinColumn({
    name: 'owner',
  })
  owner: User;
}
