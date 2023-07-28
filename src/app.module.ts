import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CrudsModule } from './cruds/cruds.module'
import { ProcessModule } from './process/process.module'


@Module({
  imports: [
    ConfigurationModule, 
    AuthModule,  
    DatabaseModule, 
    CrudsModule,
    ProcessModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
