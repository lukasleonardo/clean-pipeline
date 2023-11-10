import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ILoginData } from '../user/interfaces/user.interface';
import moment = require('moment');
import { JsonWebKey } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateToken(access_token): Promise<any> {
    //receber no parametro;
    //decode do token;
    //verificar se o token expirado;
    //verificar se o usarId isAdmin;
    return;
  }

  async login(loginData: ILoginData): Promise<JsonWebKey> {
    const { login, password } = loginData;
    const user = await this.userService.findOne(login);

    if (!user && !bcrypt.compareSync(password, user.password)) {
      throw new HttpException(
        { message: 'Login or Password incorrect!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const expireIn = moment().local().add(60, 'seconds');

    const payload = { userId: user.id, expireIn };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}