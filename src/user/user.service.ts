import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';
import { IUserService } from './interfaces/userService.interface';
import { roles } from '../shared/global.enum';
import { promises } from 'dns';
import { validate } from 'class-validator';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    //const userNew = new UserEntity()
    const { name, login, password, province, cpf, fines, isAdmin, state, idFavorites } = createUserDto;
    const newUser = new UserEntity()
    newUser.name = name
    newUser.login = login
    newUser.password = password
    newUser.province = province
    newUser.cpf = cpf
    newUser.fines = fines
    newUser.isAdmin = isAdmin
    newUser.state = state
    newUser.idFavorites = idFavorites

    const checCpf = await this.userRepository.findOneBy({cpf:cpf})
    const checkUser = await this.userRepository.findOneBy({login:login})
    if (checkUser || checCpf){
      const error = {user: 'user already exists'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    const errors = await validate(newUser);
    if (errors.length > 0){
      const _errors = { checkUser: 'User is not valid'};
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.entityManager.getRepository(UserEntity)
      savedUser.save(newUser)
      return newUser; 
    }
  }

  findForFine(id: string) {}

  async findAll() {
    const listUsers = await this.userRepository.find()
    return listUsers;
  }

  async findOne(id: string) {
    const listUser = await this.userRepository.findOneBy({id});
    return listUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkId = await this.userRepository.findOneBy({id});
    if(!checkId){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
    else {
      const { name, login, password, province, cpf, fines, isAdmin, state, idFavorites } = updateUserDto;
      const user = new UserEntity();
      user.name = name;
      user.login = login;
      user.password = password;
      user.province = province;
      user.cpf = cpf;
      user.fines = fines;
      user.isAdmin = isAdmin;
      user.state = state;
      const checkUser = await this.userRepository.findOneBy({login: login})
      if (checkUser){
        const error = {user: 'user already exists'};
        throw new HttpException(
          {message: 'Input data validation failed', error },
          HttpStatus.BAD_REQUEST,
        );
      }

    const errors = await validate(user);
    if (errors.length > 0){
      const _errors = { checkUser: 'User is not valid'};
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    }
      const userUpdate = await this.userRepository.save(user);
      return userUpdate;
    } 
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  auth(username: string, password: string) {
    // PASSAPORT.JS
    return 'logado';
  }

  /*ADMINISTRADOR*/
  setToAdmin(id: string) {
    return 'marca um usuario como admin';
  }

  setBookState(bookId: string) {
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

  bookmarkBook(bookId: string) {
    return 'adciona livro dos favoritos';
  }

  removeBookmarkBook(bookId: string) {
    return 'remove livro dos favoritos';
  }
  // como mostrar array no bagulho //  tip LIST>
  findAllBookmarked(...bookId: BookEntity[]) {}

  // recebe um livro ou um id
  requestBook(bookId: string) {
    return 'solicita livro para empréstimo';
  }
}
