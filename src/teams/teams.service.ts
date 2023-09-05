import { Injectable } from '@nestjs/common';
import { ProfileTypes } from '../common/enums/ProfileTypes';
import { Roles } from '../common/enums/Roles';
import { Status } from '../common/enums/status';
import { paginate } from '../common/pagination/paginate';
import { CreateProfileRbacDto } from '../porfiles-rbacs/dtos/create-profile-rbac.dto';
import { ProfilesRbacsService } from '../porfiles-rbacs/profiles-rbacs.service';
import { ProfilesTypesService } from '../profiles-types/profiles-types.service';
import { CreateProfileDto } from '../profiles/dtos/create-profile.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { RolesService } from '../roles/roles.service';
import { User } from '../users/user.entity';
import { Equal, In } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private profilesRbacsService: ProfilesRbacsService,
    private rolService: RolesService,
  ) {}

  async find({ limit, page, search, orderBy, sortedBy }, user: User) {
    const startIndex = (page - 1) * limit;
    let condition = {
      status: In([Status.ACTIVE]),
      children: {
        status: In([Status.ACTIVE]),
      },
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
      relations: {
        children: true,
      },
    });

    let dataCount = await this.profilesService.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }

  async create(payload, user) {
    let parent = null;
    await this.profilesService.findById(payload.parent_id).then((p) => {
      parent = p;
    });

    let profileType = null;
    await this.profileTypeService.findByName(ProfileTypes.TEAM).then((pt) => {
      profileType = pt;
    });

    let rolOwner = null;
    await this.rolService.findByName(Roles.OWNER).then((r) => {
      rolOwner = r;
    });

    const owner = new User();
    owner.id = user.id;

    let profileDto = new CreateProfileDto();
    profileDto.name = payload.name;
    profileDto.address = payload.address;
    profileDto.parent = parent;
    profileDto.owner = owner;
    profileDto.profileType = profileType;

    let team = null;
    await this.profilesService
      .create({
        name: profileDto.name,
        address: profileDto.address,
        owner: profileDto.owner,
        profileType: profileType,
        parent: parent,
      })
      .then((te) => {
        team = te;
      });

    let profileRbacDto = new CreateProfileRbacDto();
    profileRbacDto.user = owner;
    profileRbacDto.rol = rolOwner;
    profileRbacDto.profile = team;

    await this.profilesRbacsService.create(profileRbacDto);

    return team;
  }

  async inactive(id: number) {
    const profileIds = [id];

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
}
