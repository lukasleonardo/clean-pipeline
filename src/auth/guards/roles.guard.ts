import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    
    if (request?.headers.username) {
      console.log(request.headers.username)
      const user = await this.userService.findOne(request.headers.username);
      console.log(user)
      return roles.includes(user.isAdmin);
    }

    return false
    
  }
}
