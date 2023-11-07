import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
        private jwtService: JwtService) {}
    async validateUser(login: string, password: string): Promise<any>{
        const user = await this.userService.findOne(login);
        if (user && bcrypt.compareSync(password, user.password)) {
            const { password , ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.login, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
