import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector, 
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // Se a rota não tem roles definidos, permita o acesso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const data = this.authService.verifyToken(request);
    console.log(data)

    if (data.username) {
      const user = await this.userService.findOne(data.username);

      if (!user) {
        return false; // Se o usuário não for encontrado, negue o acesso
      }

      // Verifique se algum dos papéis do usuário está incluído nos papéis permitidos
      console.log(roles);
      console.log(user.isAdmin)

      return roles.some((role) => user.isAdmin.includes(role));
    }

    return false; // Se não houver nome de usuário nos dados, negue o acesso
  }
}