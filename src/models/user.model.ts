import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export class UserModel {
  id?: number;

  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;

  @IsEnum({
    teacher: 'TEACHER',
    student: 'STUDENT',
  })
  userType: string;

  isActive?: boolean;
}

export class UserPayload {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}
