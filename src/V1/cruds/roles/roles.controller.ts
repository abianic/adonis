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

import { RolesService } from './roles.service';
import { Rol } from './rol.entity';

@ApiTags('roles')
@Controller('V1/cruds/roles')
export class ProfilesController {
  constructor(
    private rolesService: RolesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List of roles' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':rolId')
  @ApiOperation({ summary: 'A roles' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  find(@Param('rolId') rolId: number) {
    return this.rolesService.findById(rolId);
  }
}
