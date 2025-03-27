import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PermissionsService } from './permissions.service';
import { Permission } from '../entities/permission.entity';

const mockPermissionRepository = {
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
