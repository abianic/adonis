import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileType } from './profile-type.entity';
import { ProfilesTypesService } from './profiles-types.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProfileType])],
  providers: [ProfilesTypesService],
  exports: [ProfilesTypesService]
})
export class ProfilesTypesModule {}
