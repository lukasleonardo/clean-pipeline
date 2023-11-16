import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RentalEntity } from './entities/rental.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RentalsService', () => {
  let rentalsService: RentalsService;
  let bookRepository: Repository<BookEntity>
  let userRepository: Repository<UserEntity>
  let rentalsRepository: Repository<RentalEntity>
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

    rentalsService = module.get<RentalsService>(RentalsService);
    rentalsRepository = module.get<Repository<RentalEntity>>(getRepositoryToken(RentalEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(rentalsService).toBeDefined();
  });

  it('should create a rental entry for a user', async () => {
    const userId = '1';
    const bookId = '2';

    const userMock: UserEntity = {
      id: userId,
      name: 'test',
      username: 'test',
      password: '1234',
      province: 'rj',
      cpf: '12345',
      role: 'USER',
      state: 'DISPONIVEL',
      favoriteBooks: []
    };

    const bookMock: BookEntity = {
      id: bookId,
      name: 'banana',
      description: 'banana',
      author: 'banana',
      value: 0,
      state: 'DISPONIVEL',
      genreList: [],
      createdBy: new UserEntity,
      createdAt: undefined
    };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userMock);
    jest.spyOn(rentalsRepository, 'find').mockResolvedValueOnce([]);
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(bookMock);
    jest.spyOn(rentalsRepository, 'save').mockImplementationOnce(async (rental) => ({
      ...rental,
      id: 'generatedId',
    } as RentalEntity));

    const result = await rentalsService.requestBook(userId, { id: bookId } as BookEntity);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    expect(rentalsRepository.find).toHaveBeenCalledWith({ where: { user: { id: userId } } });
    expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: bookId });
    expect(rentalsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        user: userMock,
        book: bookMock,
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        user: userMock,
        book: bookMock,
      }),
    );
  });

  it('should throw BadRequest exception if user, rentals, or book is not found', async () => {
    const userId = '1';
    const bookId = 'bookId';
  
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
    jest.spyOn(rentalsRepository, 'find').mockResolvedValueOnce([]);
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
  
    await expect(rentalsService.requestBook(userId, { id: bookId } as BookEntity)).rejects.toThrowError(
      new HttpException('Request for book Failed', HttpStatus.BAD_REQUEST),
    );
  });

  it('should retrieve all fines', async () => {
    const rentalMock1: RentalEntity = {
      id: '1', fines: 10,
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      user: new UserEntity,
      book: new BookEntity
    };
    const rentalMock2: RentalEntity = {
      id: '2', fines: 5,
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      user: new UserEntity,
      book: new BookEntity
    };
    const rentalMock3: RentalEntity = {
      id: '3', fines: 8,
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      user: new UserEntity,
      book: new BookEntity
    };

    const findAllSpy = jest.spyOn(rentalsRepository, 'find').mockResolvedValue([rentalMock1, rentalMock2, rentalMock3]);

    const result = await rentalsService.retrieveAllFines();

    expect(result).toEqual([rentalMock1, rentalMock2, rentalMock3]);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should handle empty fines list', async () => {
    const findAllSpy = jest.spyOn(rentalsRepository, 'find').mockResolvedValue([]);

    const result = await rentalsService.retrieveAllFines();

    expect(result).toEqual([]);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should find all rentals for a user', async () => {
    const userId = '1';
    const userRentalsMock: UserEntity = {
      id: userId,
      name: 'teste',
      username: 'teste',
      password: '1234',
      province: 'rj',
      cpf: '1234',
      role: 'USER',
      state: 'DISPONIVEL',
      favoriteBooks: []
    };
    const rentalMock1: RentalEntity = {
      id: '1', user: userRentalsMock,
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      fines: 0,
      book: new BookEntity
    };
    const rentalMock2: RentalEntity = {
      id: '2', user: userRentalsMock,
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      fines: 0,
      book: new BookEntity
    };

    const findOneBySpy = jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userRentalsMock);
    const findSpy = jest.spyOn(rentalsRepository, 'find').mockResolvedValue([rentalMock1, rentalMock2]);

    const result = await rentalsService.findAllFromUser(userId);

    expect(result).toEqual([rentalMock1, rentalMock2]);
    expect(findOneBySpy).toHaveBeenCalledWith({ id: userId });
    expect(findSpy).toHaveBeenCalledWith({ where: { user: { id: userId } } });
  });

  it('should handle user with no rentals', async () => {
    const userId = '1';
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
  
    await expect(rentalsService.findAllFromUser(userId)).rejects.toThrowError(
      new HttpException('User not found ', HttpStatus.BAD_REQUEST)
    );
  });

  it('should remove a rental', async () => {
    const rentalMock: RentalEntity = {
      id: '1',
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      fines: 0,
      user: new UserEntity,
      book: new BookEntity
    };

    jest.spyOn(rentalsService['rentalRepository'], 'findOneBy').mockResolvedValueOnce(rentalMock);
    jest.spyOn(rentalsService['rentalRepository'], 'remove').mockResolvedValueOnce(undefined);

    const result = await rentalsService.remove('1');

    expect(result).toEqual({
      message: 'Item removed successfully',
      status: HttpStatus.OK,
    });
  });

    it('should throw an internal server error when failed to delete the item', async () => {
    jest.spyOn(rentalsService['rentalRepository'], 'findOneBy').mockResolvedValueOnce({
      id: '1',
      loanDate: new Date(),
      expiratedLoanDate: undefined,
      fines: 0,
      user: new UserEntity,
      book: new BookEntity
    });

    jest.spyOn(rentalsService['rentalRepository'], 'remove').mockRejectedValueOnce(new Error('Failed to delete'));

    await expect(rentalsService.remove('1')).rejects.toThrowError(
      new HttpException('Failed to delete the item', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
