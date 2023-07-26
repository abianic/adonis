import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileType } from './profile-type.entity';
import { ProfilesTypesService } from './profiles-types.service'
import { ProfilesController } from './profiles-types.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProfileType])],
  controllers: [ProfilesController],
  providers: [ProfilesTypesService],
  exports: [ProfilesTypesService]
})
export class ProfilesTypesModule {}
