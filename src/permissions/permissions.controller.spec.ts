import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { PermissionsController } from './permissions.controller';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { PermissionsService } from './permissions.service';
import { Permission } from '../entities/permission.entity';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
  find: jest.fn(),
};

const mockPermissionRepository = {
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

describe('PermissionsController', () => {
  let controller: PermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        JwtService,
        UsersService,
        PermissionsService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
