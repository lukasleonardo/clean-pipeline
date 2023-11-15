import { GenreEntity } from "../../genre/entities/genre.entity";
import { CreateBookDto } from "../dto/create-book.dto";
import { UpdateBookDto } from "../dto/update-book.dto";
import { BookEntity } from "../entities/book.entity";

export interface IBookService {
  create(createBookD: CreateBookDto, request:string):Promise<BookEntity>;
  findAll():Promise<BookEntity[]>
  findOne(id: string): Promise<BookEntity>
  findByGenre(genreId: string):Promise<BookEntity[]>
  update(id: string, updateBookDto: UpdateBookDto):Promise<BookEntity>
  remove(id: string)
  setBookState(id: string):Promise<BookEntity>
  addGenreToBook(bookid:string, genreid:GenreEntity):Promise<BookEntity>
  removeGenreFromBook(bookid: string, genreid: GenreEntity):Promise<BookEntity>
}
