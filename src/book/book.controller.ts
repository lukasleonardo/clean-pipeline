import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { GenreEntity } from '../genre/entities/genre.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService,
    private readonly authService: AuthService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto, @Req() request: Request) {
    const decodeTk = this.authService.verifyToken(request)
    const {username} = decodeTk
    return this.bookService.create(createBookDto, username);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Get('genre/:id')
  findByGenre(@Param('id') genreid: string) {
    return this.bookService.findByGenre(genreid);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Post('set/:id')
  setBookState(@Param('id') id: string) {
    return this.bookService.setBookState(id);
  }

  @Post('genre/:id') 
  addGenreToBook(@Param('id') bookid:string, @Body() genreid:GenreEntity){
    return this.bookService.addGenreToBook(bookid,genreid)
  }

  @Delete('genre/:id')
  removeGenreFromBook(@Param('id') bookid:string, @Body() genreid:GenreEntity){
    return this.bookService.removeGenreFromBook(bookid,genreid)
  }

}
