import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';
import { IUserService } from './interfaces/userService.interface';
import { Role } from '../shared/global.enum';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name, username, password, province, cpf } = createUserDto;
    const newUser = new UserEntity()
    newUser.name = name
    newUser.username = username
    newUser.password = bcrypt.hashSync(password, 8)
    newUser.province = province
    newUser.cpf = cpf
  

    const checCpf = await this.userRepository.findOneBy({cpf:cpf})
    const checkUser = await this.userRepository.findOneBy({username:username})
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
      const savedUser = await this.userRepository.save(newUser)
      return savedUser; 
    }
  }

  async findAll() {
    const listUsers = await this.userRepository.find()
    return listUsers;
  }

  async findOne(username: string) {
    const listUser = await this.userRepository.findOneBy({username});
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
    if(user.username == updateUserDto.username){
      const error = {user: 'login already exists'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
      else{
        user.username = updateUserDto.username;
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

  // fazer o rota marcar usuario
  async setToAdmin(id: string) {
    const user = await this.userRepository.findOneBy({id});

    if (!user){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
   
    user.isAdmin = Role.admin;
    
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }


  borrowedBooks(borrowedbooks: BookEntity[]) {
    return 'retorna todos os livros emprestado';
  }

  //*LIVROS *//

  bookmarkBook(bookId: string) {
    return 'adciona livro dos favoritos';
  }

  removeBookmarkBook(bookId: string) {
    return 'remove livro dos favoritos';
  }
  
  findAllBookmarked(bookId: BookEntity[]) {
    return'retorna todos os livros'
  }


  requestBook(bookId: string) {
    return 'solicita livro para empréstimo';
  }
}
