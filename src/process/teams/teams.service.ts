import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';
import { paginate } from 'src/common/pagination/paginate';
import { ProfilesRbacsService } from 'src/cruds/porfiles-rbacs/profiles-rbacs.service';
import { ProfilesTypesService } from 'src/cruds/profiles-types/profiles-types.service';
import { Profile } from 'src/cruds/profiles/profile.entity';
import { User } from 'src/cruds/users/user.entity';
import { Equal, In, Repository } from 'typeorm';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Profile)
    private entityProfileRepository: Repository<Profile>,
    private profileTypeService: ProfilesTypesService,
    private profilesRbacsService: ProfilesRbacsService,
  ) {}

  async find({ limit, page, search, orderBy, sortedBy }, user: User) {
    const startIndex = (page - 1) * limit;
    let condition = {};

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

    let data = await this.entityProfileRepository.find({
      where: condition,
      order: sortObject,
      take: limit,
      skip: startIndex,
      relations: {
        children: true,
      },
    });

    let dataCount = await this.entityProfileRepository.count({
      where: condition,
    });

    return {
      data: data,
      ...paginate(dataCount, page, limit, data.length),
    };
  }
}
