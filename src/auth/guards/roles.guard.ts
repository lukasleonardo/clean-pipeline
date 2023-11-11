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

    if (request?.user.userId) {
      const user = await this.userService.findOne(request.user.username);
      return roles.includes(user.isAdmin);
    }

    return false
    
  }
}
