import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './entities/genre.entity';
import { UpdateRequestMiddleware } from '../auth/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity, UserEntity, BookEntity])],
  controllers: [GenreController],
  providers: [GenreService,AuthService, UserService, JwtService],
})
export class GenreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateRequestMiddleware)
      .forRoutes('genre')     
  }
}
