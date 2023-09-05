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

import { LimitDto } from '../common/pagination/limit.dto';
import { PageDto } from '../common/pagination/page.dto';
import { SearchDto } from '../common/pagination/search.dto';
import { OrderByDto } from '../common/pagination/order-by.dto';
import { SortedByDto } from '../common/pagination/sorted-by.dto.';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UnauthorizedResponse } from '../common/responses/unauthorized.response';
import { BadRequestResponse } from '../common/responses/bad-request.response';

import { User } from '../users/user.entity';

import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Profile } from './profile.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  @ApiQuery({ name: 'limit', type: LimitDto })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'search', type: SearchDto })
  @ApiQuery({ name: 'orderBy', type: OrderByDto })
  @ApiQuery({ name: 'sortedBy', type: SortedByDto })
  @ApiOperation({ summary: 'List of profiles' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query('page') page: PageDto,
    @Query('limit') limit: LimitDto,
    @Query('orderBy') orderBy: OrderByDto,
    @Query('sortedBy') sortedBy: SortedByDto,
    @Query('search') search: SearchDto,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.findAll(
      {
        page,
        limit,
        search,
        orderBy,
        sortedBy,
      },
      user.id,
    );
  }

  @Get('user-profiles')
  @UseGuards(AccessTokenGuard)
  async getUserAdminProfiles(@CurrentUser() user: User) {
    return this.profilesService.getUserAdminProfiles(user);
  }

  @Get('user-event-types')
  @UseGuards(AccessTokenGuard)
  async getUserEventTypes(@CurrentUser() user: User) {
    return this.profilesService.getUserEventTypes(user);
  }

  @Get(':profileId')
  @ApiOperation({ summary: 'A profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(@Param('profileId') profileId: number) {
    return this.profilesService.findById(profileId);
  }

  @Post()
  @ApiOperation({ summary: 'Create profile' })
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
  create(@Body() payload: CreateProfileDto) {
    return this.profilesService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
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
  update(@Param('id') id: number, @Body() payload: UpdateProfileDto) {
    return this.profilesService.update(id, payload);
  }

  @Put(':id/change-status/:status')
  @ApiOperation({ summary: 'Update the status profile' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
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
  changeStatus(@Param('id') id: number, @Param('status') status: string) {
    return this.profilesService.changeStatus(id, { status: status });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  @ApiResponse({
    description: 'The record has been successfully removed.',
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: number) {
    return await this.profilesService
      .findById(id)
      .then((profile) => {
        return this.profilesService.remove(profile);
      })
      .catch((error) => {
        return error;
      });
  }
}
