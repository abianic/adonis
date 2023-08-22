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
import { UsersService } from '../../cruds/users/users.service';

import { ProfilesTypesService } from '../../cruds/profiles-types/profiles-types.service';

import { ProfilesService } from '../../cruds/profiles/profiles.service';
import { CreateProfileDto } from '../../cruds/profiles/dtos/create-profile.dto';
import { UpdateProfileDto } from '../../cruds/profiles/dtos/update-profile.dto';
import { Profile } from '../../cruds/profiles/profile.entity';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';

import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';

import { retry } from 'rxjs';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PaginationParamsDto } from 'src/common/pagination/pagination-params.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private userService: UsersService,
    private organizationsService: OrganizationsService,
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
  async create(@Body() payload: CreateOrganizationDto, @CurrentUser() user) {
    let theUser = null;
    await this.userService.findById(user.sub).then((u) => {
      theUser = u;
    });

    let profileDto = new CreateProfileDto();
    await this.profileTypeService
      .findByName(ProfileTypes.ORGANIZATION)
      .then((pt) => {
        profileDto.name = payload.name;
        profileDto.address = payload.address;
        profileDto.owner = theUser;
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
      organization = og;
    });

    if (profileDto.profileType.name === ProfileTypes.ORGANIZATION) {
      let parent = null;
      await this.profilesService.findById(organization.id).then((p) => {
        parent = p;
      });
      await this.profilesService.create({
        name: profileDto.name + ' Team 1',
        address: profileDto.address,
        owner: profileDto.owner,
        profileType: profileType,
        parent: parent,
      });

      return parent;
    } else {
      return organization;
    }
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'List of organizations' })
  async find(
    @Query() paginationDataDto: PaginationParamsDto,
    @CurrentUser() user: User,
  ) {
    return this.organizationsService.find(paginationDataDto, user);
  }
}
