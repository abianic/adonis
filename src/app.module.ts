import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EventsModule } from './events/events.module';
import { CrudsModule } from './V1/cruds/cruds.module'

@Module({
  imports: [
    ConfigurationModule, 
    AuthModule, 
    UsersModule, 
    DatabaseModule, 
    ScheduleModule, 
    EventsModule,
    CrudsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
