import { Module, forwardRef} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [ forwardRef(()=>AuthModule) ,TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService]
})

export class UserModule {}
