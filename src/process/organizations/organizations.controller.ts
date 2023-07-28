import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { 
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { LimitDto } from '../../common/pagination/limit.dto';
import { PageDto } from '../../common/pagination/page.dto';
import { SearchDto } from '../../common/pagination/search.dto';
import { OrderByDto } from '../../common/pagination/order-by.dto';
import { SortedByDto } from '../../common/pagination/sorted-by.dto.';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { BadRequestResponse } from '../../common/responses/bad-request.response';

import { User } from '../../cruds/users/user.entity';

import { ProfilesTypesService } from '../../cruds/profiles-types/profiles-types.service';

import { ProfilesService } from '../../cruds/profiles/profiles.service';
import { CreateProfileDto } from '../../cruds/profiles/dtos/create-profile.dto';
import { UpdateProfileDto } from '../../cruds/profiles/dtos/update-profile.dto';
import { Profile } from '../../cruds/profiles/profile.entity';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';
import { retry } from 'rxjs';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService : ProfilesTypesService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Profile,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UnauthorizedResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() payload: CreateProfileDto) {
    if(payload.profileType.name !== ProfileTypes.ORGANIZATION
      && payload.profileType.name !== ProfileTypes.ONEMAN){
      let br =  new (BadRequestResponse);
      br.message = "This is not an organization";
      br.statusCode = 404;
      return br;
    }
    
    let profileType = null;
    await this.profileTypeService.findByName(ProfileTypes.TEAM).then(pt => {
      profileType = pt;
    });

    let organization = null;
    await this.profilesService.create(payload).then(og => {
      organization = og;
    });

    if(payload.profileType.name === ProfileTypes.ORGANIZATION){
      let parent = null;
      await this.profilesService.findById(organization.id).then(p => {
        parent = p;
      });
      await this.profilesService.create({
        name : payload.name + " Team 1",
        address: payload.address,
        owner: payload.owner,
        profileType: profileType,
        parent: parent
      });

      return parent;
    }else{
      return organization
    }
  }
}
