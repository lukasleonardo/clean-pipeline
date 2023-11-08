import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IBookService } from './interfaces/bookService.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { objectState } from '../shared/authorize/global.enum';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>
  ){

  }
  async create(createBookDto: CreateBookDto):Promise<BookEntity> {

    const {name, description, author, value, genreId} = createBookDto
    const book = await this.bookRepository.findOneBy({ name: name });
    if(book){
      const error = { book: 'book already exists in table book' };
      throw new HttpException(
        { message: 'Input data validation failed', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBook = new BookEntity();
    newBook.name=name;
    newBook.description=description;
    newBook.author=author;
    newBook.value=value;
    newBook.genre = [genreId]

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

  async findAll():Promise<BookEntity[]>{
    const book = await this.bookRepository.find();
    if(!book){
      throw new HttpException(
        { message: 'No books have been found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  async findOne(id: string): Promise<BookEntity>{
    const book = await this.bookRepository.findOneBy({ id });
    if(!book){
      throw new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  async findByGenre(genreId: string) {

    //Relações não funcionam
    const book = this.bookRepository.createQueryBuilder('genres_books').leftJoin('book_id == :id',genreId)
    if(!book){
      throw new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto):Promise<BookEntity> {
    const {name, description, author, value, genreId} = updateBookDto
    const newBook = await this.bookRepository.findOneBy({id});
    if(!newBook){
      const error = { book: 'book does not exists' };
      throw new HttpException(
        { message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
    newBook.name=name;
    newBook.description=description;
    newBook.author=author;
    newBook.value=value;
    newBook.genre = [genreId]

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

  async remove(id: string) {
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
  // definir regra de negocio!!!
  applyFine(id: string) {
    return 'taxa por atraso na devolução';
  }

  async setBookState(id: string) {
    const book = await this.bookRepository.findOneBy({ id });
    if(!book){
      throw new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      );
    }

    if(book.state == objectState.disponivel){
      book.state= objectState.indisponivel
    }else{
      book.state = objectState.disponivel
    }
    await this.bookRepository.save(book)
    return book;

    return 'Altera o status do livro';
  }
}
