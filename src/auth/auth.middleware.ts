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
    const data = this.authService.verifyToken(req);
    if (data.username) {
      req.user = await this.userService.findOne(data.username);
    }

    next();
  }
}