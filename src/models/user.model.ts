import { IsString, IsEmail, MinLength, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class UserSearchModel {
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  userType?: string;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  page: number;
  limit: number;
}
