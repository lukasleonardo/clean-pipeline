import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ILoginData } from './interfaces/user.interface';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginData: ILoginData){
    return this.authService.login(loginData);
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':login')
  findOne(@Param('login') login: string) {
    return this.userService.findOne(login);
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('set/admin/:id')
  setToAdmin(@Param('id') id: string) {
    return this.userService.setToAdmin(id);
  }

  @Get('books')
  borrowedBooks(borrowedbooks: BookEntity[]) {
    return 'retorna todos os livros emprestado';
  }

  @Post('bookmark/:id')
  bookmarkBook(@Param('id') bookId: string) {
    return 'adciona livro dos favoritos';
  }

  @Delete('bookmark/:id')
  removeBookmarkBook(@Param('id') bookId: string) {
    return 'remove livro dos favoritos';
  }

  @Get('bookmark')
  findAllBookmarked(bookId: BookEntity[]) {}

  @Post('request/:id')
  requestBook(@Param('id') bookId: string) {
    return 'solicita livro para empréstimo';
  }
}
