import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SALT_ROUDNS } from '../constants';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/create-user.dto';
import { ITokens } from './types';
import { ProfilesService } from '../profiles/profiles.service';
import { ProfilesTypesService } from 'src/profiles-types/profiles-types.service';
import { CreateProfileDto } from '../profiles/dtos/create-profile.dto';
import { ProfileTypes } from 'src/common/enums/ProfileTypes';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/common/enums/Roles';
import { ProfilesRbacsService } from '../porfiles-rbacs/profiles-rbacs.service';
import { CreateProfileRbacDto } from '../porfiles-rbacs/dtos/create-profile-rbac.dto';
import { CreateScheduleDto } from '../schedule/dtos/create-schedule.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { AvailabilitiesService } from '../availabilities/availabilities.service';
import { Days } from 'src/common/enums/Days';
import { CreateAvailabilityDto } from '../availabilities/dtos/create-availability.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private profilesService: ProfilesService,
    private profileTypeService: ProfilesTypesService,
    private rolService: RolesService,
    private profileRbacService: ProfilesRbacsService,
    private ScheduleService: ScheduleService,
    private AvailabilityService: AvailabilitiesService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ITokens> {
    const newUser = await this.usersService.createUser(createUserDto);

    let profileRbacDto = new CreateProfileRbacDto();
    profileRbacDto.user = newUser;
    await this.rolService.findByName(Roles.OWNER).then((ro) => {
      profileRbacDto.rol = ro;
    });

    // profile creation
    let profileDto = new CreateProfileDto();
    profileDto.name = createUserDto.name;
    profileDto.owner = newUser;
    profileDto.slug = createUserDto.username;

    await this.profileTypeService.findByName(ProfileTypes.ONEMAN).then((pt) => {
      profileDto.profileType = pt;
    });

    await this.profilesService.getProfileService().then((parent) => {
      profileDto.parent = parent;
    });

    await this.profilesService.create(profileDto).then((og) => {
      profileRbacDto.profile = og;
    });

    const userProfileId = profileRbacDto.profile.id;

    await this.profileRbacService.create(profileRbacDto);

    let scheduleDto = new CreateScheduleDto();
    scheduleDto.name = 'Default';
    scheduleDto.profileId = profileRbacDto.profile.id;
    let newSchedule = null;
    await this.ScheduleService.create(scheduleDto, newUser).then((s) => {
      newSchedule = s;
    });

    const days = Object.values(Days);
    for (const day of days) {
      let availabilityDto = new CreateAvailabilityDto();
      availabilityDto.day = day;
      availabilityDto.beginAt = '08:00:00';
      availabilityDto.endAt = '18:00:00';
      availabilityDto.schedule = newSchedule;

      await this.AvailabilityService.create(availabilityDto);
    }

    const tokens = await this.getTokens(newUser, userProfileId);

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

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

    const profile = await this.profilesService.getUserProfile(user);

    const tokens = await this.getTokens(user, profile.id);
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

    const profile = await this.profilesService.getUserProfile(user);

    const tokens = await this.getTokens(user, profile.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private compareHashes(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }

  async getTokens(user: User, profileId: number): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          profileId: profileId,
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
