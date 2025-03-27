import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthGuard } from '../guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
  find: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthGuard,
        JwtService,
        UsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
