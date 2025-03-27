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
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginRequest, TokenResponse } from '../responses/auth.response';

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
  register(@Body(new ValidationPipe()) user: UserModel) {
    return this.authservice.register(user);
  }

  @Get('/profile')
  @UseGuards(AuthGuard, PermissionGuard)
  profile(@Request() request: { user: UserPayload }) {
    const user: UserPayload = request.user;
    return this.authservice.profile(user.id);
  }

  @Get('/profile-2')
  @UseGuards(AuthGuard, PermissionGuard)
  profile2(@Request() request: { user: UserPayload }) {
    const user: UserPayload = request.user;
    return this.authservice.profile2(user.username);
  }

  @Post('/reset-password')
  resetPassword(@Body() body: { email: string }) {
    return this.authservice.resetPassword(body.email);
  }
}
