import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProfilesService } from '../profiles/profiles.service';
import { UsersService } from '../users/users.service';
import { ProfilesTypesService } from '../profiles-types/profiles-types.service';
import { ProfilesRbacsService } from '../porfiles-rbacs/profiles-rbacs.service';
import { RolesService } from '../roles/roles.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];
  const profileService = application.get(ProfilesService);
  const userService = application.get(UsersService);
  const profileTypeService = application.get(ProfilesTypesService);
  const profilesRbacsService = application.get(ProfilesRbacsService);
  const rolesService = application.get(RolesService);

  let profileType = null;
  await profileTypeService.findById(1).then((pt) => {
    profileType = pt;
  });
  let owner = null;
  await userService.findById(1).then((u) => {
    owner = u;
  });

  let masterProfile = null;
  await profileService
    .create({
      name: 'Adonis',
      address: 'In some Guayaquil Place',
      owner: owner,
      profileType: profileType,
      parent: null,
    })
    .then((p) => {
      console.log(p);
      masterProfile = p;
    });

  profileType = null;
  await profileTypeService.findById(5).then((pt) => {
    profileType = pt;
  });

  let profile = null;
  await profileService
    .create({
      name: owner.name,
      address: 'In some Guayaquil Place',
      owner: owner,
      profileType: profileType,
      parent: masterProfile,
      slug: owner.username,
    })
    .then((p) => {
      console.log(p);
      profile = p;
    });

  let role = null;
  await rolesService.findById(1).then((r) => {
    role = r;
  });

  await profilesRbacsService
    .create({
      profile: profile,
      user: owner,
      rol: role,
    })
    .then((p) => {
      console.log(p);
    });

  owner = null;
  await userService.findById(2).then((u) => {
    owner = u;
  });

  await profileService
    .create({
      name: owner.name,
      address: 'In some Guayaquil Place',
      owner: owner,
      profileType: profileType,
      parent: masterProfile,
      slug: owner.username,
    })
    .then((p) => {
      console.log(p);
      profile = p;
    });

  await profilesRbacsService
    .create({
      profile: profile,
      user: owner,
      rol: role,
    })
    .then((p) => {
      console.log(p);
    });

  console.log('Test Setup profiles');

  await application.close();
  process.exit(0);
}

bootstrap();
