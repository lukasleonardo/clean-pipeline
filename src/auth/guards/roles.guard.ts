import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector, 
    private userService: UserService,
    private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const data = this.authService.verifyToken(request)
    console.log(data)
    if (data.username) {
      const user = await this.userService.findOne(data.username);
      return roles.includes(user.isAdmin);
    }

    return false
    
  }
}
