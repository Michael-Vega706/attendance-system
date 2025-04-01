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

export class CourseStudentRequest {
  @ApiProperty()
  hasView: boolean;
}

export class UserResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
}

export class CourseStudentResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  student: UserResponse;
  @ApiProperty()
  hasView: boolean;
}

export class HealthyResponse {
  @ApiProperty()
  status: string;
}

export class ErrorResponse {
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
  @ApiProperty()
  statusCode: number;
}
