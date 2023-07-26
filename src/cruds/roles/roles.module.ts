import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { RolesService } from './roles.service'
import { ProfilesController } from './roles.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [ProfilesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
