import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { BookEntity } from '../book/entities/book.entity';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post(':id')
  requestBook(@Param('id') userid:string, @Body() book: BookEntity) {
    return this.rentalsService.requestBook(userid, book);
  }

  @Get()
  retrieveAllFines() {
    return this.rentalsService.retrieveAllFines();
  }

  @Get(':id')
  findAllFromUser(@Param('id') userid: string) {
    return this.rentalsService.findAllFromUser(userid);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(id);
  }


  // @Get('fines')
  // applyFines() {
  //   return this.rentalsService.applyFines();
  // }
}
