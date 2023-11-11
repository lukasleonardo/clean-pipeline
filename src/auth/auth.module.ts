import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt/jwt.strategy';


@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule), 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s'},
    })],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService]
})
export class AuthModule {}
