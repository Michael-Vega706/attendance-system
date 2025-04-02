import { ApiProperty } from '@nestjs/swagger';
import { UserType } from 'src/entities/user.entity';

/* REQUESTS */
export class LoginRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
export class UserRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
  @ApiProperty({
    description: 'Type of user, either TEACHER or STUDENT',
    enum: UserType,
    example: UserType.STUDENT,
  })
  userType: UserType;
}

export class ResetPasswordRequest {
  @ApiProperty()
  email: string;
}

export class RoleRequest {
  @ApiProperty()
  name: string;
}

/* RESPONSES */
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

export class UserResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
}

export class ProfileResponse extends UserResponse {
  @ApiProperty({
    description: 'Type of user, either TEACHER or STUDENT',
    enum: UserType,
    example: UserType.TEACHER,
  })
  userType: UserType;
  @ApiProperty()
  isActive: boolean;
}

export class UserRegisterResponse extends ProfileResponse {
  @ApiProperty()
  password: string;
  @ApiProperty()
  hasReset: boolean;
}

export class RoleResponse extends RoleRequest {
  @ApiProperty()
  id: number;
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

export class ResetPasswordResponse {
  @ApiProperty()
  message: string;
}
