import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IBookService } from './interfaces/bookService.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { objectState } from '../shared/global.enum';
import { GenreEntity } from '../genre/entities/genre.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ){

  }
  async create(createBookDto: CreateBookDto, username: string):Promise<BookEntity> {
    const {name, description, author, value, genres} = createBookDto
  
    const admin = await this.userRepository.findOneBy({ username: username })
    const newBook = new BookEntity();
    newBook.name = name;
    newBook.description = description;
    newBook.author = author;
    newBook.value = value;
    newBook.genreList = genres;
    newBook.createdBy = admin;

    const errors = await validate(newBook);
    if (errors.length > 0) {
      const errors = { book: 'book input is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed' + errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedBook = await this.bookRepository.save(newBook);
      return savedBook;
    }

  }

  async findAll(): Promise<BookEntity[]> {
    const book = await this.bookRepository.find();
    if(!book){
      return []
    }
    return book;
  }

  async findOne(id: string): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  async findByGenre(genreId: string):Promise<BookEntity[]> {
    try {
      const books = await this.bookRepository.find({
        where: {
          genreList: {
            id: genreId,
          },
        },
      });

      if (books.length === 0) {
        throw new HttpException('No books found with this genre', HttpStatus.NOT_FOUND);
      }

      return books;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid input data at id', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const { name, description, author, value } = updateBookDto
    const newBook = await this.bookRepository.findOneBy({ id });
    if (!newBook) {
      const error = { book: 'book does not exists' };
      throw new HttpException(
        { message: 'Book not found', error },
        HttpStatus.NOT_FOUND,
      );
    }
    newBook.name=name;
    newBook.description=description;
    newBook.author=author;
    newBook.value=value;

    const errors = await validate(newBook);
    if (errors.length > 0) {
      const errors = { book: 'book input is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed' + errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedBook = await this.bookRepository.save(newBook);
      return savedBook;
    }
  }

  async remove(id: string){
    const book = await this.bookRepository.findOneBy({ id });
    if (book) {
      await this.bookRepository.delete(book.id);
      const status = {
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      };
      return status;
    } else {
      throw new HttpException(
        { message: 'book not found' },
        HttpStatus.NOT_FOUND,
      );
    };
  }


  async setBookState(id: string):Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      );
    }
    if(book.state == objectState.disponivel){
      book.state = objectState.indisponivel
    }else{
      book.state = objectState.disponivel
    }
    const savedBook = await this.bookRepository.save(book)
    return savedBook;
  }

async addGenreToBook(bookid:string, genreid:GenreEntity){
    const book = await this.bookRepository.findOneBy( {id:bookid} )
    if(book){
      const genre = await this.genreRepository.findOneBy({id:genreid.id})
      const genreExists = book.genreList.some((genre) => genre.id === genreid.id );
      if(!genreExists && genre != null){
        book.genreList.push(genre)
        return await this.bookRepository.save(book)
      }
    } else {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }
    
async removeGenreFromBook(bookid: string, genreid: GenreEntity) {
        const book = await this.bookRepository.findOneBy( {id:bookid} )
        if (book) {
          book.genreList = book.genreList.filter((genre) => genre.id !== genreid.id);
          return await this.bookRepository.save(book)
        } else {
          throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
  }
}