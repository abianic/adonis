import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../cruds/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ProfilesModule } from 'src/cruds/profiles/profiles.module';
import { ProfilesTypesModule } from 'src/cruds/profiles-types/profiles-types.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    ProfilesModule,
    ProfilesTypesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
