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
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { CreateUserDto } from '../users/create-user.dto';
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
  @ApiOperation({ summary: 'SignUp' })
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
  @ApiOperation({ summary: 'Login' })
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
  @ApiOperation({ summary: 'Get User profile' })
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
  @ApiOperation({ summary: 'Refresh Access Token' })
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
    console.log('req.user:', req.user);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
