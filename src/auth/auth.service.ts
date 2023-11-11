import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import moment = require('moment');
import { JsonWebKey } from 'crypto';
import { UserEntity } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}


  async login(user: UserEntity): Promise<JsonWebKey> {
    const { username, password } = user;
    const signedUser = await this.userService.findOne(username)
    console.log(signedUser.password)
    console.log(user.password)
    if (!bcrypt.compareSync(password, signedUser.password)) {
      throw new HttpException(
        { message: 'Login or Password incorrect!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const expireIn = moment().local().add(60, 'seconds');
    const payload = { username: signedUser.username, sub: signedUser.id, expireIn };
    return {
      id:signedUser.id,
      access_token: this.jwtService.sign(payload)
    };
   
  }
}

//bcrypt.compare(password, signedUser.password)