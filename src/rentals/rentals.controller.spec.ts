import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { RentalEntity } from './entities/rental.entity';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('RentalsController', () => {
  let jwtService:JwtService
  let authService:AuthService
  let userService:UserService
  let rentalController: RentalsController;
  let bookRepository: Repository<BookEntity>
  let userRepository: Repository<UserEntity>
  let rentalRepository: Repository<RentalEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [RentalsService,
        {
        provide:getRepositoryToken(BookEntity),  
        useClass: Repository,
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      },{provide:getRepositoryToken(RentalEntity),  
        useClass: Repository,
      },UserService, AuthService, JwtService],
    }).compile();
    jwtService = module.get<JwtService>(JwtService)
    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    rentalController = module.get<RentalsController>(RentalsController);
    rentalRepository = module.get<Repository<RentalEntity>>(getRepositoryToken(RentalEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(rentalController).toBeDefined();
  });
});
