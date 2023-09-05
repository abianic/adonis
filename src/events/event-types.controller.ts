import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
} from '@nestjs/common';

import { EventTypesService } from './event-types.service';
import { CreateEventTypeDto } from './dtos/create-event-type.dto';
import { User } from '../users/user.entity';

import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UnauthorizedResponse } from '../common/responses/unauthorized.response';
import { BadRequestResponse } from '../common/responses/bad-request.response';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { EventType } from './event-type.entity';
import { PaginationParamsDto } from 'src/common/pagination/pagination-params.dto';

@ApiTags('Event Types')
@Controller('event-types')
export class EventTypesController {
  constructor(private eventTypesService: EventTypesService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'List of event types' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  find(
    @Query() paginationDataDto: PaginationParamsDto,
    @CurrentUser() user: User,
  ) {
    return this.eventTypesService.find(paginationDataDto, user);
  }

  @Get(':eventTypeId')
  @ApiOperation({ summary: 'A event type' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  findById(@Param('eventTypeId') eventTypeId: number) {
    return this.eventTypesService.findById(eventTypeId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new event type' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: EventType,
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
  async create(
    @Body() payload: CreateEventTypeDto,
    @CurrentUser() user: User,
  ): Promise<EventType> {
    return this.eventTypesService.create({ ...payload, user });
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update an event type' })
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: string,
    @Body() todo: CreateEventTypeDto,
    @CurrentUser() user: User,
  ) {
    return this.eventTypesService.update(+id, todo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  // @ApiResponse({
  //   description: 'The record has been successfully created.',
  //   type: Profile,
  // })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: UnauthorizedResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestResponse,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  async delete(@Param('id') id: number) {
    return await this.eventTypesService
      .findById(id)
      .then((profile) => {
        return this.eventTypesService.remove(profile);
      })
      .catch((error) => {
        return error;
      });
  }

  @Get('by-username/:username')
  findByUsername(@Param('username') username: string) {
    return this.eventTypesService.findByUsername(username);
  }
}
