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

export enum OrganizationStatus {
  PENDENTING  = 'pendenting',
  ACTIVE      = 'active',
  INACTIVE    = 'inactive',
  TERMINATED  = 'terminated',
}

@Entity()
export class Organization {
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
    enum: OrganizationStatus,
    default: OrganizationStatus.PENDENTING,
    nullable: false
  })
  status: OrganizationStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'owner',
  })
  owner: User;
}
