import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';
import { IUserService } from './interfaces/userService.interface';
import { roles } from '../shared/global.enum';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

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
    newUser.password = bcrypt.hashSync(password, 8)
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

  async findOne(login: string) {
    const listUser = await this.userRepository.findOneBy({login});
    return listUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id});
    if(!user){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }

    if(updateUserDto.name){
      user.name = updateUserDto.name;
    }
    if(user.login == updateUserDto.login){
      const error = {user: 'login already exists'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
      else{
        user.login = updateUserDto.login;
      }
    
    if(updateUserDto.password){
      user.password = updateUserDto.password;
    }
    if(updateUserDto.province){
      user.province = updateUserDto.province;
    }
    if(updateUserDto.name){
      user.name = updateUserDto.name;
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

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({id});
    if (!user){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.remove(user);
    return true;
  }

  //auth(username: string, password: string) {
    // PASSAPORT.JS
  //  return 'logado';
  //}

  /*ADMINISTRADOR*/
  async setToAdmin(id: string) {
    const user = await this.userRepository.findOneBy({id});

    if (!user){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
   
    user.isAdmin = roles.admin;
    
    const savedUser = await this.userRepository.save(user);
    return savedUser;
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
