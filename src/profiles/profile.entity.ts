import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Status } from '../common/enums/status';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';

@Entity()
export class Profile {
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
    nullable: false
  })
  status: Status;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'owner',
  })
  owner: User;
}
