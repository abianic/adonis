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

import { AvailabilitiesService } from './availabilities.service';
import { UsersService } from '../users/users.service';
import { CreateAvailabilityDto } from './dtos/create-availability.dto';
import { UpdateAvailabilityDto } from './dtos/update-availability.dto';
import { User } from '../users/user.entity';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
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
import { Availability } from './availability.entity';
import { Equal } from 'typeorm';
import { ScheduleService } from '../schedule/schedule.service';


@Controller('schedule/:scheduleId/availability')
@ApiTags('Availability')
export class AvailabilitiesController {
  constructor(
    private availabilityService: AvailabilitiesService,
    private scheduleService: ScheduleService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List of roles' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Param('scheduleId') scheduleId: number) {
    return this.availabilityService.findAll(scheduleId);
  }

  @Get(':availabilityId')
  @ApiOperation({ summary: 'A availability' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(
    @Param('scheduleId') scheduleId: number, 
    @Param('availabilityId') availabilityId: number
  ) {
    return this.availabilityService.findById(availabilityId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an availability' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Availability,
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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  async create(
    @Body() payload: CreateAvailabilityDto, 
    @Param('scheduleId') scheduleId: number
  ) {
    await this.scheduleService.findById(scheduleId).then(s => {payload.schedule = s;});
    return this.availabilityService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update availability' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: Availability,
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
  update(
    @Param('scheduleId') scheduleId: number, 
    @Param('id') id: number, 
    @Body() payload: UpdateAvailabilityDto
  ) {
    return this.availabilityService.update(id, payload);
  }

  @Put(':id/change-status/:status')
  @ApiOperation({ summary: 'Update the status availability' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: Availability,
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
    @Param('scheduleId') scheduleId: number, 
    @Param('id') id: number, 
    @Param('status') status: string
  ) { 
    return this.availabilityService.changeStatus(id, {status: status});
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete availability' })
  @ApiResponse({
    description: 'The record has been successfully removed.',
    type: Availability,
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
  async delete(
    @Param('scheduleId') scheduleId: number, 
    @Param('id') id: number
  ) {
    return await this.availabilityService.findById(id).then((availability) => {
      return this.availabilityService.remove(availability);
    }).catch(error => {
      return error;
    });
  }
}
