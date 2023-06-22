import { ApiProperty } from '@nestjs/swagger';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: number;
}

export class LoginResponse implements ITokens {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: 1686717540 })
  accessTokenExpiry: number;
}

export class ProfileResponse {
  @ApiProperty({ example: 1 })
  sub: number;

  @ApiProperty({ example: 'crisgarlez' })
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Cris Garlez' })
  name: string;

  @ApiProperty({ example: 1686713940 })
  iat: number;

  @ApiProperty({ example: 1686713940 })
  exp: number;

  @ApiProperty({ example: 1 })
  id: number;
}
