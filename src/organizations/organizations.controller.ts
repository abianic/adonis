import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UnauthorizedResponse } from '../common/responses/unauthorized.response';
import { BadRequestResponse } from '../common/responses/bad-request.response';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

import { ProfilesTypesService } from '../profiles-types/profiles-types.service';

import { ProfilesService } from '../profiles/profiles.service';
import { CreateProfileDto } from '../profiles/dtos/create-profile.dto';
import { Profile } from '../profiles/profile.entity';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';

import { CreateOrganizationDto } from './dtos/create-organization.dto';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PaginationParamsDto } from 'src/common/pagination/pagination-params.dto';
import { OrganizationsService } from './organizations.service';
import { ProfilesRbacsService } from 'src/porfiles-rbacs/profiles-rbacs.service';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/common/enums/Roles';
import { CreateProfileRbacDto } from 'src/porfiles-rbacs/dtos/create-profile-rbac.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private profileRbacService: ProfilesRbacsService,
    private rolService: RolesService,
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

    return await this.organizationsService.processToCreateOrganization(
      payload,
      theUser,
    );
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

  @Get('/inactive/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update the status profile' })
  inactive(@Param('id') id: number) {
    return this.organizationsService.inactive(id);
  }
}
