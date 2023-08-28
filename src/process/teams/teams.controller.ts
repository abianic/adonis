import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from '../../cruds/users/user.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { PaginationParamsDto } from 'src/common/pagination/pagination-params.dto';
import { TeamsService } from './teams.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'List of teams' })
  async find(
    @Query() paginationDataDto: PaginationParamsDto,
    @CurrentUser() user: User,
  ) {
    return this.teamsService.find(paginationDataDto, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @UseGuards(AccessTokenGuard)
  async create(@Body() payload: any, @CurrentUser() user) {
    return this.teamsService.create(payload, user);
  }

  @Get('/inactive/:id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update the status profile' })
  inactive(@Param('id') id: number) {
    return this.teamsService.inactive(id);
  }
}
