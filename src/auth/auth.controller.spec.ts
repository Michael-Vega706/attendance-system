import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

import { LoginModel } from '../models/login.model';
import { User } from '../entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from '../entities/role.entity';

import * as bcrypt from 'bcryptjs';

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

const mockMailerService = {
  sendMail: jest.fn(),
};

const mockRoleRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const hashPassword = await bcrypt.hash('password', 12);

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              username: 'test',
              password: hashPassword,
            }),
          },
        },
        { provide: JwtService, useValue: mockJwtService },
        MailService,
        RolesService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: MailerService, useValue: mockMailerService },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token', async () => {
    const loginData: LoginModel = {
      username: 'test',
      password: 'password',
    };
    const result = await controller.login(loginData);
    expect(result).toEqual({ access_token: 'token', type: 'Bearer' });
  });
});
