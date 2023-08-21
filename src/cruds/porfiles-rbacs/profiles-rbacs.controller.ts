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

import { User } from '../users/user.entity';

import { ProfilesRbacsService } from './profiles-rbacs.service';
import { CreateProfileRbacDto } from './dtos/create-profile-rbac.dto';
import { UpdateProfileRbacDto } from './dtos/update-profile-rbac.dto';
import { ProfileRbac } from './profile-rbac.entity';

@ApiTags('profilesRbacs')
@Controller('profilesRbacs')
export class ProfilesRbacsController {
  constructor(
    private profilesRbacsService: ProfilesRbacsService
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', type: LimitDto})
  @ApiQuery({ name: 'page', type: PageDto})
  @ApiQuery({ name: 'search', type: SearchDto})
  @ApiQuery({ name: 'orderBy', type: OrderByDto})
  @ApiQuery({ name: 'sortedBy', type: SortedByDto})
  @ApiOperation({ summary: 'List of profilesRbacs' })
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
    return this.profilesRbacsService.findAll(
      {
        page, 
        limit, 
        search, 
        orderBy, 
        sortedBy
      }, 
      user.id
    );
  }

  @Get(':profileId')
  @ApiOperation({ summary: 'A profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(@Param('profileRbacId') profileRbacId: number) {
    return this.profilesRbacsService.findById(profileRbacId);
  }

  @Post()
  @ApiOperation({ summary: 'Create profile' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProfileRbac,
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
  create(@Body() payload: CreateProfileRbacDto) {
    return this.profilesRbacsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: ProfileRbac,
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
  update(@Param('id') id: number, @Body() payload: UpdateProfileRbacDto) {
    return this.profilesRbacsService.update(id, payload);
  }

  @Put(':id/change-status/:status')
  @ApiOperation({ summary: 'Update the status profile' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: ProfileRbac,
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
  changeStatus(
    @Param('id') id: number, 
    @Param('status') status: string) { 
    return this.profilesRbacsService.changeStatus(id, {status: status});
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  @ApiResponse({
    description: 'The record has been successfully removed.',
    type: ProfileRbac,
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
    return await this.profilesRbacsService.findById(id).then((profileRbac) => {
      return this.profilesRbacsService.remove(profileRbac);
    }).catch(error => {
      return error;
    });
  }
}
