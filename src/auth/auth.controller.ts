import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { LoginModel } from '../models/login.model';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth/auth.guard';

import { UserModel, UserPayload } from '../models/user.model';
import { PermissionGuard } from '../guards/permission/permission.guard';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  LoginRequest,
  ProfileResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  TokenResponse,
  UserRegisterResponse,
  UserRequest,
} from '../responses/auth.response';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginRequest,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbbiden.' })
  @ApiResponse({ status: HttpStatus.OK, type: TokenResponse })
  login(@Body() loginModel: LoginModel): any {
    return this.authservice.signIn(loginModel.username, loginModel.password);
  }

  @Post('/register')
  @ApiBody({
    type: UserRequest,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserRegisterResponse })
  register(@Body(new ValidationPipe()) user: UserModel) {
    return this.authservice.register(user);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiResponse({ status: HttpStatus.OK, type: ProfileResponse })
  profile(@Request() request: { user: UserPayload }) {
    const user: UserPayload = request.user;
    return this.authservice.profile(user.id);
  }

  @Get('/profile-2')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: ProfileResponse })
  @UseGuards(AuthGuard, PermissionGuard)
  profile2(@Request() request: { user: UserPayload }) {
    const user: UserPayload = request.user;
    return this.authservice.profile2(user.username);
  }

  @Post('/reset-password')
  @ApiBody({
    type: ResetPasswordRequest,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResetPasswordResponse })
  resetPassword(@Body() body: { email: string }) {
    return this.authservice.resetPassword(body.email);
  }
}
