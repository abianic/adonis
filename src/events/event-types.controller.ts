import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { EventTypesService } from './event-types.service';
import { CreateEventTypeDto } from './create-event-type.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

import { LimitDto } from '../common/pagination/limit.dto';
import { PageDto } from '../common/pagination/page.dto';
import { SearchDto } from '../common/pagination/search.dto';
import { OrderByDto } from '../common/pagination/order-by.dto';
import { SortedByDto } from '../common/pagination/sorted-by.dto.';

import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Event Types')
@Controller('event-types')
export class EventTypesController {
  constructor(private eventTypesService: EventTypesService) {}

  @Get('/find')
  // @ApiQuery({ name: 'limit', type: LimitDto })
  // @ApiQuery({ name: 'page', type: PageDto })
  // @ApiQuery({ name: 'search', type: SearchDto })
  // @ApiQuery({ name: 'orderBy', type: OrderByDto })
  // @ApiQuery({ name: 'sortedBy', type: SortedByDto })
  @ApiOperation({ summary: 'List of event types' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() payload: CreateEventTypeDto, @CurrentUser() user: User) {
    return this.eventTypesService.create({ ...payload, user });
  }
}
