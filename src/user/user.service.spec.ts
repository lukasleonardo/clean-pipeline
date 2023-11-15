import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>
  let bookRepository: Repository<BookEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: getRepositoryToken(BookEntity),
        useClass: Repository
      }, {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        }],
    }).compile();

    userService = module.get<UserService>(UserService);
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      // Arrange
      const mockUserList: UserEntity[] = [
        {
          id: "1",
          name: 'teste4',
          username: 'teste4',
          password: '12345',
          province: 'rio de janeiro',
          cpf: '17378660743',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: [],
        },
        {
          id: "2",
          name: 'teste5',
          username: 'teste5',
          password: '12345',
          province: 'rio de janeiro',
          cpf: '1737866075543',
          isAdmin: 'USER',
          state: 'DISPONIVEL',
          favoriteBooks: [],
        }
      ];

      jest.spyOn(userService['userRepository'], 'find').mockResolvedValueOnce(mockUserList);

      const result = await userService.findAll();

      expect(result).toEqual(mockUserList);
    });
  });

  describe('findOne', () => {
    it('should find a user by username', async () => {
      const username = 'test';
      const mockUser: UserEntity = {
        id: '1',
        name: 'test',
        username: 'test',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(mockUser);

      const result = await userService.findOne(username);

      expect(result).toEqual(mockUser);
    });

    it('should throw a not found exception if user is not found', async () => {
      const username = 'teste2';

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.findOne(username)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { user: 'user not found' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'banana',
        username: 'banana',
        password: '654321',
        province: 'SP',
        cpf: '987654321',
      };

      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'teste',
        password: '123456',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);
      jest.spyOn(userService['userRepository'], 'save').mockResolvedValueOnce({ ...existingUser, ...updateUserDto });

      const result = await userService.update(userId, updateUserDto);

      expect(result).toEqual({ ...existingUser, ...updateUserDto });
    });

    it('should throw a not found exception if user is not found', async () => {
      const userId = '2';
      const updateUserDto: UpdateUserDto = {
        name: 'banana',
        username: 'banana',
        password: '54321',
        province: 'sp',
        cpf: '987654321',
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.update(userId, updateUserDto)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { user: 'user not found' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw a bad request exception if username already exists', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'teste',
        username: 'banana',
        password: '54321',
        province: 'sp',
        cpf: '987654321',
      };

      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);

      await expect(userService.update(userId, updateUserDto)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { user: 'login already exists' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';

      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);
      jest.spyOn(userService['userRepository'], 'remove').mockResolvedValueOnce(undefined);
      const result = await userService.remove(userId);

      expect(result).toEqual({
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      });
    });

    it('should throw a not found exception if user is not found', async () => {
      const userId = '2';

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.remove(userId)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { user: 'user not found' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('setToAdmin', () => {
    it('should set user to admin', async () => {
      const userId = '1';

      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);
      jest.spyOn(userService['userRepository'], 'save').mockResolvedValueOnce(existingUser);

      const result = await userService.setToAdmin(userId);

      expect(result.isAdmin).toBe('ADMIN');
    });

    it('should throw a not found exception if user is not found', async () => {
      const userId = '2';

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.setToAdmin(userId)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { user: 'user not found' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('bookmarkbook', () => {
    it('should bookmark a book for a user', async () => {
      const userId = '1';
      const bookEntity: BookEntity = {
        id: '1',
        name: 'galos galaticos',
        description: 'galos galaticos',
        author: 'galo',
        value: 0,
        state: 'DISPONIVEL',
        genreList: [],
        createdBy: {
          id: '2',
          name: 'teste2',
          username: 'teste2',
          password: '12345',
          province: 'rj',
          cpf: '12324545',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: []
        },
        createdAt: new Date(),
      };

      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      };

      const existingBook: BookEntity = {
        id: '2',
        name: 'uma historia de amor',
        description: 'amor',
        author: 'luciano',
        value: 29.99,
        state: 'disponivel',
        genreList: [],
        createdBy: {
          id: '2',
          name: 'teste2',
          username: 'teste2',
          password: '12345',
          province: 'rj',
          cpf: '12324545',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: []
        },
        createdAt: new Date(),
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);
      jest.spyOn(userService['bookRepository'], 'findOneBy').mockResolvedValueOnce(existingBook);
      jest.spyOn(userService['userRepository'], 'save').mockResolvedValueOnce(existingUser);

      const result = await userService.bookmarkBook(userId, bookEntity);
      expect(result.favoriteBooks.length).toBe(1);
      expect(result.favoriteBooks[0]).toEqual(existingBook);
    });


    it('should throw a not found exception if the user is not found', async () => {
      const userId = '1';
      const bookId = 'bookId';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.bookmarkBook(userId, { id: bookId } as BookEntity)).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a not found exception if the book is already in favorites', async () => {
      const userId = '1';
      const bookId = 'bookId';

      const userMock: UserEntity = {
        id: userId,
        favoriteBooks: [{ id: bookId } as BookEntity],
        name: 'teste2',
        username: 'teste2',
        password: '12345',
        province: 'rj',
        cpf: '12324545',
        isAdmin: 'ADMIN',
        state: 'DISPONIVEL',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userMock);
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce({ id: bookId } as BookEntity);

      await expect(userService.bookmarkBook(userId, { id: bookId } as BookEntity)).rejects.toThrowError(
        new HttpException('Book already in favorites', HttpStatus.NOT_FOUND),
      );
    });


  });

  describe('remove bookmark', () => {
    it('should remove a bookmarked book for a user', async () => {
      const userId = '1';
      const book: BookEntity = {
        id: '2',
        name: 'book',
        description: 'book',
        author: 'book',
        value: 49.99,
        state: 'DISPONIVEL',
        genreList: [],
        createdBy: {
          id: '2',
          name: 'teste',
          username: 'teste',
          password: '123345',
          province: 'r',
          cpf: '1313241',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: []
        },
        createdAt: new Date(),
      };
      const existingUser: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [book],
      }

      const userAfterRemove: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      }
      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(existingUser);

      jest.spyOn(userService['userRepository'], 'save').mockResolvedValueOnce(userAfterRemove);

      const result = await userService.removeBookmarkBook(userId, book);

      expect(result.favoriteBooks).toEqual([]);
    });


    it('should throw a not found exception if the user is not found', async () => {
      const userId = '3';
      const user: UserEntity = {
        id: userId,
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '123456789',
        isAdmin: 'USER',
        state: 'DISPONIVEL',
        favoriteBooks: [],
      }
      const book: BookEntity = {
        id: '1',
        name: 'book',
        description: 'book',
        author: 'luciano',
        value: 49.99,
        state: 'DISPONIVEL',
        genreList: [],
        createdBy: {
          id: '2',
          name: 'teste',
          username: 'teste',
          password: '12345',
          province: 'rj',
          cpf: '1234355',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: []
        },
        createdAt: new Date(),
      };

      jest.spyOn(userService['userRepository'], 'findOneBy').mockResolvedValueOnce(null);

      await expect(userService.removeBookmarkBook(userId, book)).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('FindAllBookmarked', () => {
    it('should return an array of bookmarked books for a user', async () => {
      // Arrange
      const userId = '1';
      const userMock: UserEntity = {
        id: userId,
        favoriteBooks: [
          { id: 'bookId1', name: 'Book 1' } as BookEntity,
          { id: 'bookId2', name: 'Book 2' } as BookEntity,
        ],
        name: 'teste',
        username: 'teste',
        password: '12345',
        province: 'rj',
        cpf: '1234355',
        isAdmin: 'ADMIN',
        state: 'DISPONIVEL'
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userMock);

      // Act
      const result = await userService.findAllBookmarked(userId);

      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(userMock.favoriteBooks);
    });

    it('should return an empty array if user has no bookmarked books', async () => {
      // Arrange
      const userId = '1';
      const userMock: UserEntity = {
        id: userId,
        favoriteBooks: [],
        name: 'teste',
        username: 'teste',
        password: '12345',
        province: 'rj',
        cpf: '1234355',
        isAdmin: 'ADMIN',
        state: 'DISPONIVEL'
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userMock);

      // Act
      const result = await userService.findAllBookmarked(userId);

      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual([]);
    });
    
    it('should throw a not found exception if user is not found', async () => {
      // Arrange
      const userId = '1';
    
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);
    
      // Act and Assert
      await expect(userService.findAllBookmarked(userId)).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});

