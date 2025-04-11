import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserPayload } from '../../models/user.model';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: {
      user: UserPayload;
    } = context.switchToHttp().getRequest();
    const userReq = request.user;
    const userDB = await this.usersService.findById(userReq.id);
    let url = request['url'];
    if (request['url'].includes('?')) {
      url = request['url'].split('?')[0];
    }
    let baseUrl = url;
    if(!url.includes('/auth/profile')) {
      baseUrl = `/${url.split('/')[1]}`;
    } else {
      baseUrl = '/auth/profile';
    }
    if (userDB) {
      if (userDB.roles) {
        if (userDB.roles.length > 0) {
          const roles = userDB?.roles[0];
          if (roles.permissions) {
            for (const permission of roles.permissions) {
              if (
                permission.name.includes(`${request['method']}:${baseUrl}`)
                || permission.name.includes(`*:${baseUrl}`)
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
