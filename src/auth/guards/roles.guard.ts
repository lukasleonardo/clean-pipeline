import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector, 
    private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    // const request = context.switchToHttp().getRequest();
    // const user = request.user;

    // return user.roles.some((role) => roles.includes(role));

    if (request?.headers.username) {
      const user = await this.userService.findOne(request.headers.username);
      return roles.includes(user.isAdmin);
    }

    return false
    
  }
}
