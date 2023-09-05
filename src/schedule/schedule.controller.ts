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
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { User } from '../users/user.entity';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
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
import { Schedule } from './schedule.entity';

@Controller('schedule')
@ApiTags('Schedule')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiQuery({ name: 'limit', type: LimitDto })
  @ApiQuery({ name: 'page', type: PageDto })
  @ApiQuery({ name: 'search', type: SearchDto })
  @ApiQuery({ name: 'orderBy', type: OrderByDto })
  @ApiQuery({ name: 'sortedBy', type: SortedByDto })
  @ApiOperation({ summary: 'List of schedules' })
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
        sortedBy,
      },
      user.id,
    );
  }

  @Get(':scheduleId')
  @ApiOperation({ summary: 'A schedule' })
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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  async create(@Body() payload: CreateScheduleDto, @CurrentUser() user) {
    await this.usersService.findById(user.sub).then((u) => {
      payload.owner = u;
    });
    return this.scheduleService.create(payload);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
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
  update(@Param('id') id: number, @Body() payload: UpdateScheduleDto) {
    return this.scheduleService.update(id, payload);
  }

  @Put(':id/change-status/:status')
  @ApiOperation({ summary: 'Update the status schedule' })
  @ApiResponse({
    description: 'The record has been successfully updated.',
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
  changeStatus(@Param('id') id: number, @Param('status') status: string) {
    return this.scheduleService.changeStatus(id, { status: status });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiResponse({
    description: 'The record has been successfully removed.',
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: number) {
    return await this.scheduleService
      .findById(id)
      .then((schedule) => {
        return this.scheduleService.remove(schedule);
      })
      .catch((error) => {
        return error;
      });
  }
}
