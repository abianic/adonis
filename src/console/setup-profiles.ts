import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProfilesService } from '../cruds/profiles/profiles.service';
import { UsersService } from 'src/cruds/users/users.service';
import { ProfilesTypesService } from '../cruds/profiles-types/profiles-types.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command = process.argv[2];
  const profileService = application.get(ProfilesService);
  const userService = application.get(UsersService);
  const profileTypeService = application.get(ProfilesTypesService);

  let profileType = null
  await profileTypeService.findById(1).then(pt => {
    profileType = pt;
  });
  let owner = null;
  await userService.findById(1).then(u => {
    owner = u;
  });
  await profileService.create({
    name: "Adonis",
    address: "In some Guayaquil Place",
    owner: owner,
    profileType: profileType,
    parent: null
  }).then(pt => {
    console.log(pt);
  });

  console.log('Test Setup profiles');

  await application.close();
  process.exit(0);
}

bootstrap();