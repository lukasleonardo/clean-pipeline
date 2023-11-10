import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt'
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => UserModule), PassportModule,
  JwtModule.register({
    secret:jwtConstants.secret,
    signOptions: { expiresIn: '60s'},
  }),],
  providers: [AuthService],
  exports: [JwtModule, AuthService]
})
export class AuthModule {}
