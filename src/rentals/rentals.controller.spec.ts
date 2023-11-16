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
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RentalsController', () => {
  let jwtService: JwtService
  let authService: AuthService
  let userService: UserService
  let rentalsController: RentalsController;
  let bookRepository: Repository<BookEntity>
  let userRepository: Repository<UserEntity>
  let rentalRepository: Repository<RentalEntity>
  let rentalsService: RentalsService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [RentalsService,
        {
          provide: getRepositoryToken(BookEntity),
          useClass: Repository,
        }, {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        }, {
          provide: getRepositoryToken(RentalEntity),
          useClass: Repository,
        }, UserService, AuthService, JwtService],
    }).compile();
    jwtService = module.get<JwtService>(JwtService)
    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    rentalsController = module.get<RentalsController>(RentalsController);
    rentalRepository = module.get<Repository<RentalEntity>>(getRepositoryToken(RentalEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    rentalsService = module.get<RentalsService>(RentalsService)
  });

  it('should be defined', () => {
    expect(rentalsController).toBeDefined();
  });

  describe('requestBook', () => {
    it('should return a new rental entity when the request is valid', async () => {
      const userId = '1';
      const bookEntity = new BookEntity(); // Provide a valid book entity

      jest.spyOn(rentalsService, 'requestBook').mockResolvedValueOnce(new RentalEntity());

      const result = await rentalsController.requestBook(userId, bookEntity);

      expect(result).toBeInstanceOf(RentalEntity);
    });

    it('should throw a HttpException with status 400 when the request fails', async () => {
      const userId = '1';
      const bookEntity = new BookEntity(); // Provide a valid book entity

      jest.spyOn(rentalsService, 'requestBook').mockRejectedValueOnce(
        new HttpException('Request for book Failed', HttpStatus.BAD_REQUEST),
      );

      await expect(rentalsController.requestBook(userId, bookEntity)).rejects.toThrowError(
        new HttpException('Request for book Failed', HttpStatus.BAD_REQUEST),
      );
    });


  });

  describe('retrieveAllFines', () => {
    it('should return an array of rentals with fines', async () => {
      // Mock do retorno esperado do serviço
      const mockedRentalsWithFines: RentalEntity[] = [
        {
          id: '1',
          loanDate: new Date(),
          expiratedLoanDate: new Date('2023-12-01'),
          user: { id: '1' } as UserEntity,
          book: { id: '1' } as BookEntity,
          fines: 10,
        },
        {
          id: '2',
          loanDate: new Date(),
          expiratedLoanDate: new Date('2023-12-01'),
          user: { id: '2' } as UserEntity,
          book: { id: '2' } as BookEntity,
          fines: 10,
        },

      ];

      jest.spyOn(rentalsService, 'retrieveAllFines').mockResolvedValueOnce(mockedRentalsWithFines);

      const result = await rentalsController.retrieveAllFines();

      expect(rentalsService.retrieveAllFines).toHaveBeenCalled();
      expect(result).toEqual(mockedRentalsWithFines);
    });
  });

  describe('findAllFromUser', () => {
    it('should return an array of rentals for the specified user', async () => {
      const userId = '1';

      const mockedUserRentals: RentalEntity[] = [
        {
          id: '1',
          loanDate: new Date(),
          expiratedLoanDate: new Date('2023-12-01'),
          user: { id: userId } as UserEntity,
          book: {} as BookEntity,
          fines: 0,
        },
        {
          id: '1',
          loanDate: new Date(),
          expiratedLoanDate: new Date('2023-12-01'),
          user: { id: userId } as UserEntity,
          book: {} as BookEntity,
          fines: 0,
        },
      ];

      jest.spyOn(rentalsService, 'findAllFromUser').mockResolvedValueOnce(mockedUserRentals);

      const result = await rentalsController.findAllFromUser(userId);

      expect(rentalsService.findAllFromUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockedUserRentals);
    });
  });

  describe('remove', () => {
    it('should remove a rental and return success status', async () => {
      const rentalId = '1';

      const mockedStatus = {
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      };

      jest.spyOn(rentalsService, 'remove').mockResolvedValueOnce(mockedStatus);

      const result = await rentalsController.remove(rentalId);

      expect(rentalsService.remove).toHaveBeenCalledWith(rentalId);
      expect(result).toEqual(mockedStatus);
    });
  });



});

