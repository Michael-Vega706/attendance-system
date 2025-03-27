import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Put,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionModel } from '../models/security.model';
import { AuthGuard } from '../guards/auth/auth.guard';
import { PermissionGuard } from '../guards/permission/permission.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post('/')
  @UseGuards(AuthGuard, PermissionGuard)
  async createPermission(@Body() payload: PermissionModel) {
    return await this.permissionsService.insertPermission(payload);
  }

  @Get('/')
  @UseGuards(AuthGuard, PermissionGuard)
  async permissionsList() {
    return await this.permissionsService.findAll();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, PermissionGuard)
  updatePermission(@Param('id') id: number, @Body() payload: PermissionModel) {
    return this.permissionsService.updatePermission(id, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, PermissionGuard)
  deletePermission(@Param('id') id: number) {
    return this.permissionsService.deletePermission(id);
  }
}
