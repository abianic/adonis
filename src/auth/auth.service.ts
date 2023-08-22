import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../cruds/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SALT_ROUDNS } from '../constants';
import { User } from '../cruds/users/user.entity';
import { CreateUserDto } from '../cruds/users/create-user.dto';
import { ITokens } from './types';
import { ProfilesService } from 'src/cruds/profiles/profiles.service';
import { ProfilesTypesService } from 'src/cruds/profiles-types/profiles-types.service';
import { CreateProfileDto } from 'src/cruds/profiles/dtos/create-profile.dto';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ITokens> {
    const newUser = await this.usersService.createUser(createUserDto);
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    // profile creation
    let profileDto = new CreateProfileDto();
    profileDto.name = createUserDto.name;
    profileDto.owner = newUser;

    await this.profileTypeService.findByName(ProfileTypes.ONEMAN).then((pt) => {
      profileDto.profileType = pt;
    });

    await this.profilesService.create(profileDto).then((og) => {});

    return tokens;
  }

  async signIn(email: string, pass: string): Promise<ITokens> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await this.compareHashes(
      pass,
      user?.password ?? '',
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await this.compareHashes(
      refreshToken,
      user?.refreshToken ?? '',
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private compareHashes(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }

  async getTokens(user: User): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '60m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    const decoded: any = this.jwtService.decode(accessToken);
    return {
      accessToken,
      refreshToken,
      accessTokenExpiry: decoded.exp,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashPassword(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, SALT_ROUDNS);
  }
}
