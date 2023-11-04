import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';
import { IUserService } from './interfaces/userService.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findForFine(id: number) {}

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  auth(username: string, password: string) {
    // PASSAPORT.JS
    return 'logado';
  }

  /*ADMINISTRADOR*/
  setToAdmin(id: number) {
    return 'marca um usuario como admin';
  }

  setBookState(bookId: number) {
    return 'Altera o status do livro';
  }

  // daqui pra baixo e tudo duvida!
  retrieveAllFines(ChargedUsers: Array<UserEntity>) {
    return 'Retorna usuarios multados';
  }

  borrowedBooks(borrowedbooks: Array<BookEntity>) {
    return 'retorna todos os livros emprestado';
  }

  //*LIVROS */

  bookmarkBook(bookId: number) {
    return 'adciona livro dos favoritos';
  }

  removeBookmarkBook(bookId: number) {
    return 'remove livro dos favoritos';
  }
  // como mostrar array no bagulho //  tip LIST>
  findAllBookmarked(...bookId: BookEntity[]) {}

  // recebe um livro ou um id
  requestBook(bookId: number) {
    return 'solicita livro para empréstimo';
  }
}
