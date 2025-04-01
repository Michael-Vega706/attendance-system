import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        return {
          access_token: await this.jwtService.signAsync(payload),
          type: 'Bearer',
        };
      }
    }
    throw new HttpException(
      'Username and/or password are incorrect.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async profile(id: number) {
    const user = await this.userService.findOneById(id);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        isActive: user.isActive,
      };
    } else {
      return null;
    }
  }

  async profile2(username: string) {
    const user = await this.userService.findOne(username);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        isActive: user.isActive,
      };
    } else {
      throw new NotFoundException('User not found.');
    }
  }

  register(user: UserModel) {
    return this.userService.createUser(user);
  }

  async resetPassword(email: string) {
    const userDB = await this.userService.findOneByEmail(email);
    if (userDB) {
      const newPassword = this.generatePasswordRandom();
      await this.mailService.sendResetPassword(userDB.email, newPassword);
      userDB.password = await bcrypt.hash(newPassword || '', 12);
      await this.userService.upsertUser(userDB);
      return { message: 'We sended your new password to your email.' };
    }
    throw new NotFoundException('User not found.');
  }

  private generatePasswordRandom(size: number = 12) {
    return crypto
      .randomBytes(Math.ceil(size / 2))
      .toString('hex')
      .slice(0, size);
  }
}
