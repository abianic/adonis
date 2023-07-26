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

import { ProfilesTypesService } from './profiles-types.service';
import { ProfileType } from './profile-type.entity';

@ApiTags('profiles-types')
@Controller('V1/cruds/profiles-types')
export class ProfilesController {
  constructor(
    private profilesTypesService: ProfilesTypesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List of profiles types' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.profilesTypesService.findAll();
  }

  @Get(':profileTypeId')
  @ApiOperation({ summary: 'A profile type' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(@Param('profileTypeId') profileTypeId: number) {
    return this.profilesTypesService.findById(profileTypeId);
  }
}
