import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
