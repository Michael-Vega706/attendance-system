import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { RoleModel } from '../models/security.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id, roles: true });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async createUser(payload: UserModel) {
    const password: string = await bcrypt.hash(payload.password || '', 12);
    return await this.userRepository.save({
      ...payload,
      password,
    });
  }

  async upsertUser(payload: UserModel) {
    return await this.userRepository.save(payload);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async assignRoles(id: number, roles: RoleModel[]) {
    const userDB: User | null = await this.findOneById(id);
    if (userDB) {
      userDB.roles = roles;
      return await this.upsertUser(userDB);
    }
    throw new NotFoundException('User not found.');
  }
}
