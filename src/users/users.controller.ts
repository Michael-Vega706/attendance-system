import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RoleModel } from '../models/security.model';
import { ApiResponse } from '@nestjs/swagger';
import { UserRegisterResponse } from 'src/responses/auth.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/assign-roles')
  assignRoles(@Param('id') id: number, @Body() payload: RoleModel[]) {
    return this.usersService.assignRoles(id, payload);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: [UserRegisterResponse] })
  listUsers() {
    return this.usersService.findAll();
  }

  @Get('/teacher/list')
  @ApiResponse({ status: HttpStatus.OK, type: [UserRegisterResponse] })
  listUsersByTeacherType() {
    return this.usersService.findByType('TEACHER');
  }
}
