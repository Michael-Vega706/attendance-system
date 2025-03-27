import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { Role } from '../entities/role.entity';

const mockRoleRepository = {
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
