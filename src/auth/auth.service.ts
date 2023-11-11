import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import moment = require('moment');
import { JsonWebKey } from 'crypto';
import { UserEntity } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { jwtConstants } from './constants';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}


  async login(user: UserEntity): Promise<JsonWebKey> {
    const { username, password } = user;
    const signedUser = await this.userService.findOne(username)

    if (!bcrypt.compareSync(password, signedUser.password)) {
      throw new HttpException(
        { message: 'Login or Password incorrect!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expireIn = moment().local().add(3600, 'seconds');
    const payload = { username: signedUser.username, sub: signedUser.id, role:signedUser.isAdmin  , expireIn };
    return {
      access_token: this.jwtService.sign(payload)
    };
   
  }


  verifyToken(token: string): any {
    console.log(token)
    return this.jwtService.verify(token, jwtConstants);
  }

  
}

//bcrypt.compare(password, signedUser.password)