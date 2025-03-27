import { Repository } from 'typeorm';
import { UsersService } from '../../users/users.service';
import { PermissionGuard } from './permission.guard';
import { User } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

describe('PermissionGuardGuard', () => {
  let permissionGuard: PermissionGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    permissionGuard = module.get<PermissionGuard>(PermissionGuard);
  });

  it('should be defined', () => {
    expect(permissionGuard).toBeDefined();
  });
});
