import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserPayload } from '../../models/user.model';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: {
      user: UserPayload;
    } = context.switchToHttp().getRequest();
    const userReq = request.user;
    const userDB = await this.usersService.findById(userReq.id);
    if (userDB) {
      if (userDB.roles) {
        if (userDB.roles.length > 0) {
          const roles = userDB?.roles[0];
          if (roles.permissions) {
            for (const permission of roles.permissions) {
              if (
                permission.name.includes(
                  `${request['method']}:${request['url']}}`,
                ) ||
                request['url'].includes(permission.name.split(':')[1])
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
}
