import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RentalEntity } from './entities/rental.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RentalsService', () => {
  let rentalService: RentalsService;
  let bookRepository: Repository<BookEntity>
  let userRepository: Repository<UserEntity>
  let rentalRepository: Repository<RentalEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalsService,{
        provide:getRepositoryToken(BookEntity),  
        useClass: Repository,
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      },{provide:getRepositoryToken(RentalEntity),  
      useClass: Repository,
    }],
    }).compile();

    rentalService = module.get<RentalsService>(RentalsService);
    rentalRepository = module.get<Repository<RentalEntity>>(getRepositoryToken(RentalEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(rentalService).toBeDefined();
  });




});
