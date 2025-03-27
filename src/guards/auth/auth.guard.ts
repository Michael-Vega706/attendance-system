import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../../models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: {
      headers: { authorization: string };
      user: UserPayload;
    } = context.switchToHttp().getRequest();
    const authorization: string = request.headers.authorization;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type !== 'Bearer') {
        throw new UnauthorizedException();
      }
      try {
        const payload: UserPayload = await this.jwtService.verifyAsync(token);
        request.user = payload;
        return true;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException();
      }
    }
    return false;
  }
}
