import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { BookGenres } from './entities/bookGenres.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity,UserEntity, BookGenres])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
