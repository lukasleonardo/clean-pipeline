import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Book } from '../book/entities/book.entity';
import { UserEntity } from './entities/user.entity';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('fine/:id')
  findForFine(@Param('id') id:number){

  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }


  // ANALISAR!!!!! à PERGUNTAR
  @Post()
  auth(@Body() username:string, password:string){
      // PASSAPORT.JS
    return 'logado';
  }

  /*ADMINISTRADOR*/
  @Post('set/admin/:id')
  setToAdmin(@Param('id') id:number){
    return 'marca um usuario como admin';
  }

  @Post('set/book/:id')
  setBookState(@Param('id') bookId:number){
    return 'Altera o status do livro';
  }

  @Get('/fines')  
  retrieveAllFines(ChargedUsers:Array<UserEntity>){
    return 'Retorna usuarios multados';
  }
  @Get('books')
  borrowedBooks(borrowedbooks: Array<Book>){
    return 'retorna todos os livros emprestado'
  }

  //*LIVROS */
  // daqui pra baixo e tudo duvida!
  @Post('bookmark/:id')
  bookmarkBook(@Param('id') bookId:number){
    return 'adciona livro dos favoritos';
  }

  @Delete('bookmark/:id')
  removeBookmarkBook(@Param('id') bookId:number){
    return 'remove livro dos favoritos';
  }
  // como mostrar array no bagulho
  @Get('bookmark')
  findAllBookmarked(...bookId: Array<Book>){
  }

  // recebe um livro ou um id
  @Post('request/:id')
  requestBook(@Param('id') bookId:number){
    return 'solicita livro para empréstimo';
  }
  


}
