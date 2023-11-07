import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [UserModule, PassportModule,
  JwtModule.register({
    secret:jwtConstants.secret,
    signOptions: { expiresIn: '60s'},
  }),],
  providers: [AuthService],
  exports: [JwtModule, AuthService]
})
export class AuthModule {}