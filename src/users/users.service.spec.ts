import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

import * as bcrypt from 'bcryptjs';

const passwordHash = async () => await bcrypt.hash('password', 12);

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn().mockResolvedValue(null),
  find: jest.fn().mockResolvedValue([]),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const user = {
      username: 'test',
      password: 'password',
      email: 'test@example.com',
      userType: 'STUDENT',
    };

    const userDB = {
      id: 1,
      username: 'test',
      password: await passwordHash(),
      email: 'test@example.com',
      userType: 'STUDENT',
    };
    mockUserRepository.save.mockResolvedValue(userDB);

    const result = await service.createUser(user);
    expect(result.id).toEqual(1);
    expect(result.userType).toEqual(user.userType);
    expect(result.username).toEqual(user.username);
    const isSame = await bcrypt.compare(user.password, result.password);
    expect(isSame).toBe(true);
    expect(result.email).toEqual(user.email);
  });

  it('should get a null user by id (not found)', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);
    const result = await service.findOneById(1);
    expect(result).toBeNull();
  });

  it('should get an user by id', async () => {
    mockUserRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@example.com',
      userType: 'STUDENT',
    });
    const result = await service.findOneById(1);
    if (result) {
      expect(result.id).toBe(1);
      expect(result.username).toBe('test');
    }
  });

  it('should get an user by username', async () => {
    mockUserRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@example.com',
      userType: 'STUDENT',
    });
    const result = await service.findOne('test');
    if (result) {
      expect(result.id).toBe(1);
      expect(result.username).toBe('test');
    }
  });

  it('should get an user by email', async () => {
    mockUserRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@example.com',
      userType: 'STUDENT',
    });
    const result = await service.findOneByEmail('test@example.com');
    if (result) {
      expect(result.id).toBe(1);
      expect(result.username).toBe('test');
    }
  });
});
