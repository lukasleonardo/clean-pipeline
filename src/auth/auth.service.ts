import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JsonWebKey } from 'crypto';
import { UserEntity } from '../user/entities/user.entity';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt'
import moment = require('moment');
import { Request } from 'express';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

  ) {}

  async login(user: UserEntity): Promise<JsonWebKey> {
    const { username, password } = user;
    const signedUser = await this.userService.findOne(username)
    
    if(!signedUser){
      throw new HttpException(
        { message: 'Login or Password incorrect!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!bcrypt.compareSync(password, signedUser.password)) {
      throw new HttpException(
        { message: 'Login or Password incorrect!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expireIn = moment().local().add(3600, 'seconds');
    const payload = { username: signedUser.username, sub: signedUser.id, role:signedUser.role  , expireIn };
    return {
      access_token: this.jwtService.sign(payload)
    }; 
  }

  verifyToken(request: Request): any {
    const token = request.headers.authorization?.split(' ')[1];
    return this.jwtService.verify(token, jwtConstants);
  }  
}
