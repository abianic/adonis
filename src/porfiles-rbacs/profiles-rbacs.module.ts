import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileRbac } from './profile-rbac.entity';
import { ProfilesRbacsService } from './profiles-rbacs.service';
import { ProfilesRbacsController } from './profiles-rbacs.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileRbac])
  ],
  controllers: [ProfilesRbacsController],
  providers: [ProfilesRbacsService],
  exports: [ProfilesRbacsService],
})
export class ProfilesRbacsModule {}
