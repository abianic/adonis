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
import { ProfileType } from '../profiles-types/profile-type.entity';
import { ProfileRbac } from '../porfiles-rbacs/profile-rbac.entity';

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

  @ApiProperty({ example: 'Torcauato Studio' })
  @Column({ name: 'name', type: 'varchar', length: 45, nullable: false })
  name: string;

  @ApiProperty({ example: 'Martires 28' })
  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
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

  @ApiProperty({ example: ProfileRbac })
  @OneToMany(() => ProfileRbac, (profileRbac) => profileRbac.profile)
  profilesRbacs: ProfileRbac[];

  @ApiProperty({ example: User, type: () => User })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({
    name: 'owner',
  })
  owner: User;

  @ApiProperty({ example: ProfileType })
  @ManyToOne(() => ProfileType, { nullable: true })
  @JoinColumn({
    name: 'profile_type_id',
  })
  profileType: ProfileType;

  @ApiProperty({ example: Profile })
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({
    name: 'parent_id',
  })
  parent: Profile;

  @OneToMany(() => Profile, (user) => user.parent)
  children: Profile[];

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  slug: string;
}
