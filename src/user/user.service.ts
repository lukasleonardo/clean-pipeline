import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
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
    const { name, username, password, province, cpf } = updateUserDto;

    const user = await this.userRepository.findOneBy({id});
    if(!user){
      const error = {user: 'user not found'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }

    if(user.username == username){
      const error = {user: 'login already exists'};
      throw new HttpException(
        {message: 'Input data validation failed', error },
        HttpStatus.NOT_FOUND,
      );
    }
      user.name = name;
      user.username = username;
      user.password = bcrypt.hashSync(password, 8);
      user.province = province;
      user.cpf = cpf 
   
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
    const status = {
      message: 'Item removed successfully',
      status: HttpStatus.OK,
    };
    return status;
  }
  
 
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

  async bookmarkBook(userId: string, bookEntity: BookEntity) {
    console.log(userId)
    console.log(bookEntity)
    try{
      const user = await this.userRepository.findOneBy( {id: userId} )
      if (user){
        const book = await this.bookRepository.findOneBy({id:bookEntity.id})
        const bookExists = user.favoriteBooks.some((user) => user.id === bookEntity.id );
        if(!bookExists && book != null){
          
          console.log(user)
          console.log(book)
          user.favoriteBooks.push(book)
          return await this.userRepository.save(user)
        }
      }else{
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    } 
  } catch (error) {
      throw new HttpException('invalid input data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeBookmarkBook(userId:string, book: BookEntity) {
    
    try {
      const user = await this.userRepository.findOneBy( {id:userId} )
      if (user) {
        user.favoriteBooks = user.favoriteBooks.filter((favoriteBooks) => favoriteBooks.id !== book.id);
        return await this.userRepository.save(user) 

      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException('Attempt to remove book from favorites failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findAllBookmarked(userid: string) {
    const listUsers = await this.userRepository.findOneBy({id: userid});
    return listUsers.favoriteBooks;
    
  }

}
