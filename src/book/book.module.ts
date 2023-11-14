import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { GenreEntity } from '../genre/entities/genre.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateRequestMiddleware } from '../auth/auth.middleware';



@Module({
  imports: [TypeOrmModule.forFeature([BookEntity,UserEntity,GenreEntity])],
  controllers: [BookController],
  providers: [BookService, AuthService, UserService, JwtService],
})
export class BookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateRequestMiddleware)
      .forRoutes('book','genre','rentals')     
  }
}
