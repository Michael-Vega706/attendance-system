import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RoleModel } from '../models/security.model';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserRegisterResponse, UserSearchQuery, UserSearchResponse } from '../responses/auth.response';
import { PermissionGuard } from '../guards/permission/permission.guard';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/assign-roles')
  @UseGuards(AuthGuard, PermissionGuard)
  assignRoles(@Param('id') id: number, @Body() payload: RoleModel[]) {
    return this.usersService.assignRoles(id, payload);
  }

  @Get('/')
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiResponse({ status: HttpStatus.OK, type: UserSearchResponse })
  listUsers(@Query() payload: UserSearchQuery) {
    return this.usersService.findAll(payload);
  }

  @Get('/teacher/list')
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiResponse({ status: HttpStatus.OK, type: [UserRegisterResponse] })
  listUsersByTeacherType() {
    return this.usersService.findByType('TEACHER');
  }
}
