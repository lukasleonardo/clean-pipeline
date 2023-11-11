import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService
    ){}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req;
    
    if (token) {
      try { 
        const decodedToken = this.authService.verifyToken(token);

       req.user = decodedToken;
      } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
        return;
      }}
      next();
  
    }
  }
