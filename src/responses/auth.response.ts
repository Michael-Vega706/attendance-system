import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    description: 'Access token to authorize in the api.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  access_token: string;
  @ApiProperty({
    description: "Token's type to authorize in the api.",
    example: 'Bearer',
  })
  type: string;
}

export class LoginRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
