import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class UpdateRequestMiddleware implements NestMiddleware {
  
  constructor(
    private authService: AuthService,
    private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Atualize a requisição com dados mais recentes, se necessário
    const data = this.authService.verifyToken(req);
    console.log(data)
    if (data.username) {
      // Atualize a requisição com informações do usuário, se disponíveis
      req.user = await this.userService.findOne(data.username);
      console.log(req.user)
    }

    next();
  }
}