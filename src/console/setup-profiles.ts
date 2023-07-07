import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProfilesTypesService } from '../profiles-types/profiles-types.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command = process.argv[2];

  console.log('Test Setup profiles');

  await application.close();
  process.exit(0);
}

bootstrap();