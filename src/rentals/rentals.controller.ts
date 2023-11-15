import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { BookEntity } from '../book/entities/book.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../shared/global.enum';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  requestBook(@Param('id') userid:string, @Body() book: BookEntity) {
    return this.rentalsService.requestBook(userid, book);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  retrieveAllFines() {
    return this.rentalsService.retrieveAllFines();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findAllFromUser(@Param('id') userid: string) {
    return this.rentalsService.findAllFromUser(userid);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  applyFines() {
    return this.rentalsService.applyFines();
  }
}
