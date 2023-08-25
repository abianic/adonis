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

@Injectable()
export class OrganizationsService {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private profilesRbacsService: ProfilesRbacsService,
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
}
