import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RoleModel } from '../models/security.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/assign-roles')
  assignRoles(@Param('id') id: number, @Body() payload: RoleModel[]) {
    return this.usersService.assignRoles(id, payload);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  listUsers() {
    return this.usersService.findAll();
  }
}
