import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Status } from '../../../../common/enums/status';
import { Exclude } from 'class-transformer';
import { Profile } from '../profile.entity';

@Entity()
export class Team {
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

  @ApiProperty({ example: "Team 1" })
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

  @ApiProperty({ example: "Martires 28" })
  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @ApiProperty({ example: Profile })
  @ManyToOne(() => Profile, { eager:true })
  @JoinColumn({
    name: 'organization',
  })
  organization: Profile;
}
