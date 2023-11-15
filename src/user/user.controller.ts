import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';
import { Role } from '../shared/global.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() user: UserEntity){
    return this.authService.login(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':login')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findOne(@Param('login') login: string) {
    return this.userService.findOne(login);
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('set/admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  setToAdmin(@Param('id') id: string) {    
    return this.userService.setToAdmin(id);
  }

  @Post('set/admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  unSetAdmin(@Param('id') id: string) {
    return this.userService.unSetAdmin(id)
  }

  @Post('bookmark/:id')
  @UseGuards(JwtAuthGuard)
  bookmarkBook(@Param('id') userid:string, @Body() book:BookEntity) {
    return this.userService.bookmarkBook(userid, book);
  }

  @Delete('bookmark/:id')
  @UseGuards(JwtAuthGuard)
  removeBookmarkBook(@Param('id') userid:string, @Body() book:BookEntity) {
    return this.userService.removeBookmarkBook(userid, book);
  }

  @Get('bookmark/:id')
  @UseGuards(JwtAuthGuard)
  findAllBookmarked(@Param('id') userid: string) {
    return this.userService.findAllBookmarked(userid);
  }
}
