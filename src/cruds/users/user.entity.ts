import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ProfileRbac } from '../porfiles-rbacs/profile-rbac.entity';
import { Profile } from '../profiles/profile.entity';

@Entity()
export class User {
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

  @ApiProperty({ example: "TorcuatoStudio" })
  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  username: string;

  @ApiProperty({ example: "Torcuato" })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: "torcuato@studuio.test" })
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: "encrypted" })
  @Column({ name: 'password', type: 'varchar', length: 255, unique: true })
  password: string;

  @ApiProperty({ example: {} })
  @Column('jsonb', { name: 'metadata', nullable: true, default: {} })
  metadata: string;

  @ApiProperty({ example: "string" })
  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({ example: ProfileRbac })
  @OneToMany(() => ProfileRbac, (profileRbac) => profileRbac.user)
  profilesRbacs: ProfileRbac[];
}
