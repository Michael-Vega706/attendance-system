import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { PermissionModel, RoleModel } from '../models/security.model';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async insertRole(payload: RoleModel) {
    return await this.roleRepository.save(payload);
  }

  async updateRole(id: number, payload: RoleModel) {
    await this.roleRepository.update(id, payload);
  }

  async deleteRole(id: number) {
    await this.roleRepository.delete({ id });
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    return await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });
  }

  async assignPermissions(id: number, permissions: PermissionModel[]) {
    const roleDB: Role | null = await this.findOne(id);
    if (roleDB) {
      roleDB.permissions = permissions;
      return await this.insertRole(roleDB);
    }
    throw new NotFoundException('Role not found.');
  }
}
