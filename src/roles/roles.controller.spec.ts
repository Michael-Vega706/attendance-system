import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { RolesController } from './roles.controller';
import { Role } from '../entities/role.entity';
import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

const mockRoleRepository = {
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
  find: jest.fn(),
};

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        JwtService,
        UsersService,
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
