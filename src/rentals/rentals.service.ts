import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { RentalEntity } from './entities/rental.entity';
import { differenceInDays } from 'date-fns';
import { objectState } from '../shared/global.enum';
import { IRentalService } from './Interfaces/rentalService.interface';

@Injectable()
export class RentalsService implements IRentalService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository:Repository<BookEntity>,
    @InjectRepository(RentalEntity)
    private readonly rentalRepository:Repository<RentalEntity>
  ){}

  async requestBook(userid:string, bookEntity: BookEntity):Promise<RentalEntity> {
    try{
      const user = await this.userRepository.findOneBy({id:userid})
      const rentals = await this.rentalRepository.find({where:{user:{id:userid}}})
      const book = await this.bookRepository.findOneBy({id:bookEntity.id})
      if(user && rentals.length<5 && book){
          const newRental = new RentalEntity()
          newRental.user = user
          newRental.book= book
          newRental.loanDate = new Date();
          newRental.expiratedLoanDate = new Date();
          newRental.expiratedLoanDate.setDate(newRental.loanDate.getDate() + 15)

          const newEntry = await this.rentalRepository.save(newRental)
          return newEntry
      }else{
        throw new HttpException('Request for book Failed', HttpStatus.BAD_REQUEST)
      }
    }catch(e){
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async retrieveAllFines():Promise<RentalEntity[]> {
    const rentals = await this.rentalRepository.find()
    return rentals;
  }

  async findAllFromUser(userid: string):Promise<RentalEntity[]> {
    const userRentals = await this.userRepository.findOneBy({id:userid})
    if(userRentals){
      const rentals = await this.rentalRepository.find({where:{user:{id:userRentals.id}}})
      return rentals
    }
  }

  

  async applyFines() {
   try{
    const rentals = await this.rentalRepository.find()
    const currentDate = new Date();

    rentals.forEach( async (rental) => {
     if(rental.expiratedLoanDate && rental.expiratedLoanDate < currentDate){ 
      const user = await this.userRepository.findOneBy({id:rental.user.id}) 
      user.state = objectState.indisponivel
      const daysDifference = differenceInDays(currentDate, rental.expiratedLoanDate);
      const multa = daysDifference * 5;
      rental.fines = multa
      await this.userRepository.save(user)
      await this.rentalRepository.save(rental)
     }
     const status = {
      message: 'Routine was concluded successfuly',
      status: HttpStatus.OK,
    }
     return status;
    }
    )
      }catch{
          throw new HttpException('Failed to apply fines', HttpStatus.INTERNAL_SERVER_ERROR)
       }
  }


  async remove(id: string){
    try{
      const rental = await this.rentalRepository.findOneBy({id});
      if(!rental){
          throw new HttpException(
            {message: 'rental not found'},
            HttpStatus.NOT_FOUND,
          );
        }
        await this.rentalRepository.remove(rental);
        const status = {
          message: 'Item removed successfully',
          status: HttpStatus.OK,
        };
        return status;     
      }catch{
        throw new HttpException('Failed to delete the item', HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }



}
