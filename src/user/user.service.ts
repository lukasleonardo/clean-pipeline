import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
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
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }
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
        { message: 'Input data validation failed', error },
        HttpStatus.BAD_REQUEST,
      );
    }

    
    const savedUser = await this.userRepository.save(newUser)
    return savedUser;
    
  }

  async findAll():Promise<UserEntity[]> {
    const listUsers = await this.userRepository.find()
    return listUsers;
  }


  async findOne(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({username});
    if (!user) {
      throw new HttpException(
        {message: 'User was not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { name, username, password, province, cpf } = updateUserDto;


    const user = await this.userRepository.findOneBy({id});
    if(!user){
        throw new HttpException(
        {message: 'User was not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.username == username) {
      const error = { user: 'login already exists' };
      throw new HttpException(
        {message: 'username already exists', error },
        HttpStatus.BAD_REQUEST,
      );
    }
    user.name = name;
    user.username = username;
    user.password = bcrypt.hashSync(password, 8);
    user.province = province;
    user.cpf = cpf

    const errors = await validate(user);
    if (errors.length > 0) {
      const _errors = { checkUser: 'User is not valid' };
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
      throw new HttpException(
        {message: 'User was not found' },
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

  
 
  async setToAdmin(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({id});
    if (!user){
      throw new HttpException(
        {message: 'User was not found'},
        HttpStatus.NOT_FOUND,
      );
    }  
    user.role = Role.admin;  
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async unSetAdmin(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({id});
    if (!user){
      throw new HttpException(
        {message: 'User was not found'},
        HttpStatus.NOT_FOUND,
      );
    } 
    user.role = Role.user;
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }


  async bookmarkBook(userId: string, bookEntity: BookEntity): Promise<UserEntity> {
      const user = await this.userRepository.findOneBy( {id: userId} )
      if (user){
        const book = await this.bookRepository.findOneBy({id:bookEntity.id})
        const bookExists = user.favoriteBooks.some((user) => user.id === bookEntity.id );
        if(!bookExists && book != null){
          user.favoriteBooks.push(book)
          return await this.userRepository.save(user)
        }
      }else{
        throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
  }

  async removeBookmarkBook(userId:string, book: BookEntity): Promise<UserEntity> {
      const user = await this.userRepository.findOneBy( {id:userId} )
      if (user) {
        user.favoriteBooks = user.favoriteBooks.filter((favoriteBooks) => favoriteBooks.id !== book.id);
        return await this.userRepository.save(user) 
      } else {
        throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
      }
    }
  
  async findAllBookmarked(userid: string): Promise<BookEntity[]> {
    const listUsers = await this.userRepository.findOneBy({id: userid});

    if (!listUsers) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return listUsers.favoriteBooks;
  }

}
