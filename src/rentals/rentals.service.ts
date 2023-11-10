import { Injectable } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService {
  create(createRentalDto: CreateRentalDto) {
    return 'This action adds a new rental';
  }

  findAll() {
    return `This action returns all rentals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rental`;
  }

  update(id: number, updateRentalDto: UpdateRentalDto) {
    return `This action updates a #${id} rental`;
  }

  remove(id: number) {
    return `This action removes a #${id} rental`;
  }

  findForFine(id: string) {}

  
  retrieveAllFines() {
    return 'Retorna usuarios multados';
  }

    // definir regra de negocio!!!
  applyFine(id: string) {
    return 'taxa por atraso na devolução';
  }
}
