import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/profiles-types/profiles-types.module';
import { RolesModule } from '../roles/roles.module';
import { ProfilesRbacsModule } from 'src/porfiles-rbacs/profiles-rbacs.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { AvailabilitiesModule } from 'src/availabilities/availabilities.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    ProfilesModule,
    ProfilesTypesModule,
    ProfilesRbacsModule,
    RolesModule,
    ScheduleModule,
    AvailabilitiesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
