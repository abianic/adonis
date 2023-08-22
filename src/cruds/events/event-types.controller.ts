import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
} from '@nestjs/common';

import { EventTypesService } from './event-types.service';
import { CreateEventTypeDto } from './dtos/create-event-type.dto';
import { User } from '../users/user.entity';

import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { LimitDto } from '../../common/pagination/limit.dto';
import { PageDto } from '../../common/pagination/page.dto';
import { SearchDto } from '../../common/pagination/search.dto';
import { OrderByDto } from '../../common/pagination/order-by.dto';
import { SortedByDto } from '../../common/pagination/sorted-by.dto.';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UnauthorizedResponse } from '../../common/responses/unauthorized.response';
import { BadRequestResponse } from '../../common/responses/bad-request.response';

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
import { EventType } from './event-type.entity';

@ApiTags('Event Types')
@Controller('event-types')
export class EventTypesController {
  constructor(private eventTypesService: EventTypesService) {}

  @Get()
  // @ApiQuery({ name: 'limit', type: LimitDto })
  // @ApiQuery({ name: 'page', type: PageDto })
  // @ApiQuery({ name: 'search', type: SearchDto })
  // @ApiQuery({ name: 'orderBy', type: OrderByDto })
  // @ApiQuery({ name: 'sortedBy', type: SortedByDto })
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'List of event types' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Successful operation.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  find(
    @Query('page') page: PageDto,
    @Query('limit') limit: LimitDto,
    @Query('orderBy') orderBy: OrderByDto,
    @Query('sortedBy') sortedBy: SortedByDto,
    @Query('search') search: SearchDto,
    @CurrentUser() user: User,
  ) {
    return this.eventTypesService.find(
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
