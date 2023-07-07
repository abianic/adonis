import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ProfilesTypesModule } from './profiles-types/profiles-types.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigurationModule, 
    AuthModule, 
    UsersModule, 
    DatabaseModule, 
    ProfilesModule, 
    ProfilesTypesModule,
    ScheduleModule, 
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
