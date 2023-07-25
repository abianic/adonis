import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { UsersService } from '../users/users.service';
import { CreateScheduleDto } from './create-schedule.dto';
import { User } from '../users/user.entity';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
@Controller('schedule')
@ApiTags('Schedule')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiResponse({
    // type: LoginResponse,
    // status: HttpStatus.OK,
    description: 'Create',
  })
  @ApiBearerAuth('access-token')
  async create(@Body() payload: CreateScheduleDto, @Request() req) {
    const user: User = await this.usersService.findById(req.user);
    return this.scheduleService.create({ ...payload, user });
  }
}
