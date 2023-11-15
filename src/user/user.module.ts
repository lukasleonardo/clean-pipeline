import { MiddlewareConsumer, Module, Post, RequestMethod, forwardRef} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { BookEntity } from '../book/entities/book.entity';
import { UpdateRequestMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [ forwardRef(()=>AuthModule) ,TypeOrmModule.forFeature([UserEntity, BookEntity])],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService]
})

export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateRequestMiddleware).exclude( 
        { path: 'user', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST })     
  }
}
