import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PermissionModel, RoleModel } from '../models/security.model';
import { RolesService } from './roles.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { PermissionGuard } from '../guards/permission/permission.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ErrorResponse,
  RoleRequest,
  RoleResponse,
} from '../responses/auth.response';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('/')
  @UseGuards(AuthGuard, PermissionGuard)
  @ApiBody({
    type: RoleRequest,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: RoleResponse })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ErrorResponse })
  createRole(@Body() payload: RoleModel) {
    return this.rolesService.insertRole(payload);
  }

  @Get('/')
  listRoles() {
    return this.rolesService.findAll();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, PermissionGuard)
  updateRole(@Param('id') id: number, @Body() payload: RoleModel) {
    return this.rolesService.updateRole(id, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, PermissionGuard)
  deleteRole(@Param('id') id: number) {
    return this.rolesService.deleteRole(id);
  }

  @Post('/:id/assign-permissions')
  @UseGuards(AuthGuard, PermissionGuard)
  assignPermissions(
    @Param('id') id: number,
    @Body() payload: PermissionModel[],
  ) {
    return this.rolesService.assignPermissions(id, payload);
  }
}
