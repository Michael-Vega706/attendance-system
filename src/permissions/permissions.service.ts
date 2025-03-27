import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { PermissionModel } from '../models/security.model';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async insertPermission(payload: PermissionModel) {
    return await this.permissionRepository.save(payload);
  }

  async updatePermission(id: number, payload: PermissionModel) {
    await this.permissionRepository.update(id, payload);
  }

  async deletePermission(id: number) {
    await this.permissionRepository.delete({ id });
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    return await this.permissionRepository.findOneBy({ id });
  }
}
