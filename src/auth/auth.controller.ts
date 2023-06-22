import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './signup-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ITokens, LoginResponse, ProfileResponse } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    type: LoginResponse,
    status: HttpStatus.OK,
    description: 'Sign Up',
  })
  signup(@Body() createUserDto: CreateUserDto): Promise<ITokens> {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({
    type: LoginResponse,
    status: HttpStatus.OK,
    description: 'Login',
  })
  login(@Body() signInDto: LoginDto): Promise<ITokens> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  @ApiResponse({
    type: ProfileResponse,
    status: HttpStatus.OK,
    description: 'Get user profile',
  })
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiResponse({
    type: LoginResponse,
    status: HttpStatus.OK,
    description: 'Refresh Access Token',
  })
  @ApiBearerAuth('access-token')
  refreshTokens(@Request() req) {
    console.log('***refresh!***');
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
