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

import { ScheduleService } from './schedule.service';
import { UsersService } from '../users/users.service';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
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
import { Schedule } from './schedule.entity';


@Controller('schedule')
@ApiTags('Schedule')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', type: LimitDto})
  @ApiQuery({ name: 'page', type: PageDto})
  @ApiQuery({ name: 'search', type: SearchDto})
  @ApiQuery({ name: 'orderBy', type: OrderByDto})
  @ApiQuery({ name: 'sortedBy', type: SortedByDto})
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
    return this.scheduleService.findAll(
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

  @Get(':scheduleId')
  @ApiOperation({ summary: 'A profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(@Param('scheduleId') scheduleId: number) {
    return this.scheduleService.findById(scheduleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Schedule,
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
  @ApiBearerAuth('access-token')
  async create(@Body() payload: CreateScheduleDto, @CurrentUser() user) {
    payload.user = await this.usersService.findById(user.sub);
    return this.scheduleService.create(payload);
  }
}
