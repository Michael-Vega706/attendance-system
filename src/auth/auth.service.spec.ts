import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

const mockUserRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOneById: jest.fn(),
  find: jest.fn(),
};

const mockMailerService = {
  sendMail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        MailService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
