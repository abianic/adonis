import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';
import { paginate } from 'src/common/pagination/paginate';
import { ProfilesRbacsService } from 'src/cruds/porfiles-rbacs/profiles-rbacs.service';
import { ProfilesTypesService } from 'src/cruds/profiles-types/profiles-types.service';
import { Profile } from 'src/cruds/profiles/profile.entity';
import { ProfilesService } from 'src/cruds/profiles/profiles.service';
import { User } from 'src/cruds/users/user.entity';
import { Equal, In, Repository } from 'typeorm';
import { Status } from '../../common/enums/status';
import { RolesService } from 'src/cruds/roles/roles.service';
import { UsersService } from 'src/cruds/users/users.service';
import { ScheduleService } from 'src/cruds/schedule/schedule.service';
import { AvailabilitiesService } from 'src/cruds/availabilities/availabilities.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CreateProfileRbacDto } from 'src/cruds/porfiles-rbacs/dtos/create-profile-rbac.dto';
import { Roles } from 'src/common/enums/Roles';
import { CreateProfileDto } from 'src/cruds/profiles/dtos/create-profile.dto';
import { CreateScheduleDto } from 'src/cruds/schedule/dtos/create-schedule.dto';
import { Days } from 'src/common/enums/Days';
import { CreateAvailabilityDto } from 'src/cruds/availabilities/dtos/create-availability.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private profilesRbacsService: ProfilesRbacsService,
    private rolService: RolesService,
    private userService: UsersService,
    private scheduleService: ScheduleService,
    private availabilityService: AvailabilitiesService
  ) {}

  async find({ limit, page, search, orderBy, sortedBy }, user: User) {
    const startIndex = (page - 1) * limit;
    let condition = {
      status: In([Status.ACTIVE]),
    };

    // let userId = user.id || null;

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // if (key === 'userId') {
        //   userId = value;
        //   if (value === 'null' || value === '') userId = null;
        // }
      }
    }

    await this.profilesRbacsService.findByUserId(user.id).then((prbcas) => {
      const prbcasIds = prbcas.map((prbca) => prbca.profile.id);
      condition['id'] = In(prbcasIds);
    });

    await this.profileTypeService
      .findByName(ProfileTypes.ORGANIZATION)
      .then((pt) => {
        condition['profileType'] = Equal(pt.id);
      });

    let sortObject = {};
    if (orderBy && sortedBy) {
      sortObject[orderBy] = sortedBy;
    }

    let data = await this.profilesService.find({
      where: condition,
      order: sortObject,
      take: limit,
      skip: startIndex,
    });

    let dataCount = await this.profilesService.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  async inactive(id: number) {
    const children = await this.profilesService.find({
      where: {
        parent: Equal(id),
      },
    });

    const childrenIds = children.map((child) => child.id);
    const profileIds = [id, ...childrenIds];

    await this.profilesRbacsService.updatByCriteria(
      {
        profile: In(profileIds),
      },
      { status: Status.INACTIVE },
    );

    return this.profilesService.updatByCriteria(
      {
        id: In(profileIds),
      },
      {
        status: Status.INACTIVE,
      },
    );
  }

  async processToCreateOrganization(payload: CreateOrganizationDto, user: User){
    let profileRbacDto = new CreateProfileRbacDto();

    let rolOwner = null;
    await this.rolService.findByName(Roles.OWNER).then((r) => {
      profileRbacDto.rol = r;
      profileRbacDto.user = user;
      rolOwner = r;
    });

    let profileDto = new CreateProfileDto();
    await this.profileTypeService.findByName(ProfileTypes.ORGANIZATION).then((pt) => {
      profileDto.name = payload.name;
      profileDto.address = payload.address;
      profileDto.owner = user;
      profileDto.profileType = pt;
    });
    await this.profilesService.getProfileService().then((p) => {
      profileDto.parent = p;
    });

    let profileType = null;
    await this.profileTypeService.findByName(ProfileTypes.TEAM).then((pt) => {
      profileType = pt;
    });

    let organization = null;
    await this.profilesService.create(profileDto).then((og) => {
      profileRbacDto.profile = og;
      organization = og;
    });

    await this.profilesRbacsService.create(profileRbacDto);

    let parent = null;
    await this.profilesService.findById(organization.id).then((p) => {
      parent = p;
    });

    let team = null;
    await this.profilesService.create({
      name: profileDto.name + ' Team 1',
      address: profileDto.address,
      owner: profileDto.owner,
      profileType: profileType,
      parent: parent,
    }).then((te) => {
      profileRbacDto.profile = te;
      team = te;
    });

    await this.profilesRbacsService.create(profileRbacDto);

    let scheduleDto = new CreateScheduleDto();
    scheduleDto.name = "Default";
    scheduleDto.owner = user;
    scheduleDto.profile = profileRbacDto.profile;
    let newSchedule = null;
    await this.scheduleService.create(scheduleDto).then(s => {
      newSchedule = s;
    });

    const days = Object.values(Days);
    for(const day of days){
      let availabilityDto = new  CreateAvailabilityDto();
      availabilityDto.day = day;
      availabilityDto.beginAt = "08:00:00";
      availabilityDto.endAt = "18:00:00";
      availabilityDto.schedule = newSchedule;

      await this.availabilityService.create(availabilityDto);
    }

    return parent;
  }
}
