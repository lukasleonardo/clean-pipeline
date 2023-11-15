import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Request } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { objectState } from '../shared/global.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GenreEntity } from '../genre/entities/genre.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { JsonWebKey } from 'crypto';


describe('BookController', () => {
  let bookRepository: Repository<BookEntity>
  let genreRepository: Repository<GenreEntity>
  let userRepository: Repository<UserEntity>
  let bookController: BookController;
  let authService: AuthService;
  let bookService: BookService;
  let userService: UserService
  let jwtService: JwtService

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService, {
        provide: getRepositoryToken(BookEntity),
        useClass: Repository,
      }, {
          provide: getRepositoryToken(GenreEntity),
          useClass: Repository
        }, {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        }, {
          provide: AuthService,
          useValue: { verifyToken: jest.fn().mockResolvedValueOnce({ username: 'adminUser' }) }
        }, UserService, JwtService],
    }).compile();

    bookService = module.get<BookService>(BookService)
    authService = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>(UserService)
    bookController = module.get<BookController>(BookController);
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(bookController).toBeDefined();
  });


  describe('create', () => {
    it('should create a book for ADMIN user', async () => {
      const book: BookEntity = {
        id: faker.string.uuid(),
        name: 'Mocked Book',
        author: 'Mocked Author',
        description: 'Mocked Description',
        value:100,
        genreList:[{id:'1',name:'Ação'}],
        state:faker.helpers.enumValue(objectState),
        createdAt: faker.date.anytime(),    
        createdBy: {
          id: "1",
          name: "Usuario",
          username: "adminUser",
          password: "password",
          province: "province",
          cpf: "99999",
          isAdmin: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
        },
      };
      const mockToken = 'mockedToken';
      const mockUsername = 'adminUser';

      const mockCreateBookDto: CreateBookDto = {
        name: 'Mocked Book',
        author: 'Mocked Author',
        description: 'Mocked Description',
        value:100,
        genres:[{id:'1',name:'Ação'}]
      };

      const mockRequest: Partial<Request> = {
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      };
      

      authService.verifyToken = jest.fn().mockResolvedValueOnce({ username: mockUsername });
      bookService.create = jest.fn().mockResolvedValueOnce(book)
      const result = await bookController.create(mockCreateBookDto, mockRequest as Request);


      expect(authService.verifyToken).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();

      expect(result).toEqual(book);
    });
  })

  describe('findAll', () => {
    it('should return an array of books', async () => {
      // Mock a list of books that you expect to be returned from the service
      const expectedBooks: BookEntity[] = [
        {
          id: '1',
          name: 'galos galaticos',
          author: 'galo',
          description: 'galos espaciais',
          value: 100,
          genreList: [{ id: '1', name: 'Ação' }],
          state: 'DISPONIVEL',
          createdAt: new Date(),
          createdBy: {
            id: "1",
            name: "Usuario",
            username: "adminUser",
            password: "password",
            province: "province",
            cpf: "99999",
            isAdmin: "ADMIN",
            state: "DISPONIVEL",
            favoriteBooks: []
          },
        },
        {
          id: '2',
          name: 'banana',
          author: 'bananada',
          description: 'bananas',
          value: 100,
          genreList: [],
          state: 'DISPONIVEL',
          createdAt: new Date(),
          createdBy: {
            id: "1",
            name: "Usuario",
            username: "adminUser",
            password: "1234",
            province: "province",
            cpf: "99999",
            isAdmin: "ADMIN",
            state: "DISPONIVEL",
            favoriteBooks: []
          }
        },
      ];

      jest.spyOn(bookService, 'findAll').mockResolvedValueOnce(expectedBooks);

      const result = await bookController.findAll()
      expect(bookService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedBooks);
    });
  });

  describe('findOne', () => {
    it('should return a single book by ID', async () => {
      const expectedBook: BookEntity = {
        id: '1',
        name: 'galos galaticos',
        author: 'galo',
        description: 'galos espaciais',
        value: 100,
        genreList: [{ id: '1', name: 'Ação' }],
        state: 'DISPONIVEL',
        createdAt: new Date(),
        createdBy: {
          id: '1',
          name: 'Usuario',
          username: 'adminUser',
          password: 'password',
          province: 'province',
          cpf: '99999',
          isAdmin: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: [],
        },
      };

      jest.spyOn(bookService, 'findOne').mockResolvedValueOnce(expectedBook);

      const result = await bookController.findOne('1');

      expect(bookService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedBook);
    });
  });

  describe('findByGenre', () => {
    it('should return books by genre', async () => {
      const genreId = '1';
      const expectedBooks: BookEntity[] = [
        {
          id: '1',
          name: 'galos galaticos',
          author: 'galo',
          description: 'galos espaciais',
          value: 100,
          state: 'DISPONIVEL',
          createdAt: new Date(),
          createdBy: null,
          genreList: [{ id: genreId, name: 'Genre 1' } as GenreEntity],
        },
        {
          id: '2',
          name: 'Book 2',
          author: 'Author 2',
          description: 'Description 2',
          value: 40.0,
          state: 'AVAILABLE',
          createdAt: new Date(),
          createdBy: null,
          genreList: [{ id: genreId, name: 'Genre 1' } as GenreEntity],
        },
      ];

      jest.spyOn(bookService, 'findByGenre').mockResolvedValueOnce(expectedBooks);

      const result = await bookController.findByGenre(genreId);

      expect(bookService.findByGenre).toHaveBeenCalledWith(genreId);
      expect(result).toEqual(expectedBooks);
    });

    it('should return empty array if no books found for the genre', async () => {
      const genreId = '2';
      const expectedBooks: BookEntity[] = [];

      jest.spyOn(bookService, 'findByGenre').mockResolvedValueOnce(expectedBooks);

      const result = await bookController.findByGenre(genreId);

      expect(bookService.findByGenre).toHaveBeenCalledWith(genreId);
      expect(result).toEqual(expectedBooks);
    });

  });

  describe('update', () => {
    it('should update a book', async () => {
      const bookId = '1';
      const updateBookDto: UpdateBookDto = {
        name: 'banana',
        author: 'banana',
        description: 'muitas bananas',
        value: 60.0,
      };

      const updatedBook: BookEntity = {
        id: bookId,
        name: 'banana',
        author: 'banana',
        description: 'muitas bananas',
        value: 60.0,
        state: 'AVAILABLE',
        createdAt: new Date(),
        createdBy: null,
        genreList: [],
      };

      jest.spyOn(bookService, 'update').mockResolvedValueOnce(updatedBook);

      const result = await bookController.update(bookId, updateBookDto);

      expect(bookService.update).toHaveBeenCalledWith(bookId, updateBookDto);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = '1';
      jest.spyOn(bookService, 'remove').mockResolvedValueOnce({ message: 'Item removed successfully', status: 200 });

      const result = await bookController.remove(bookId);

      expect(bookService.remove).toHaveBeenCalledWith(bookId);
      expect(result).toEqual({ message: 'Item removed successfully', status: 200 });
    });
  });

  describe('setBookState', () => {
    it('should set the state of a book', async () => {
      const bookId = '1';
      const updatedBook: BookEntity = {
        id: bookId,
        name: 'banana',
        author: 'banana',
        description: 'muitas bananas',
        value: 60.0,
        state: 'AVAILABLE',
        createdAt: new Date(),
        createdBy: null,
        genreList: [],
      };

      jest.spyOn(bookService, 'setBookState').mockResolvedValueOnce(updatedBook);

      const result = await bookController.setBookState(bookId);

      expect(bookService.setBookState).toHaveBeenCalledWith(bookId);

      expect(result).toEqual(updatedBook);
    });

    it('should handle a not found exception', async () => {
      const bookId = '1';

      jest.spyOn(bookService, 'setBookState').mockRejectedValueOnce({
        message: 'No book found with this id',
        status: HttpStatus.NOT_FOUND,
      });

      await expect(bookController.setBookState(bookId)).rejects.toEqual({
        message: 'No book found with this id',
        status: HttpStatus.NOT_FOUND,
      });

      expect(bookService.setBookState).toHaveBeenCalledWith(bookId);
    });

  });

  describe('addGenreToBook', () => {
    it('should add a genre to a book', async () => {
      const bookId = '1';
      const genreId = '2';
      const updatedBook: BookEntity = {
        id: '1',
        name: 'banana',
        author: 'banana',
        description: 'muitas bananas',
        value: 60.0,
        state: 'AVAILABLE',
        createdAt: new Date(),
        createdBy: null,
        genreList: [],
      };
      const genreEntity: GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(bookService, 'addGenreToBook').mockResolvedValueOnce(updatedBook);

      const result = await bookController.addGenreToBook(bookId, genreEntity);

      expect(bookService.addGenreToBook).toHaveBeenCalledWith(bookId, genreEntity);

      expect(result).toEqual(updatedBook);
    });

    it('should handle a not found exception', async () => {
      const bookId = '1';
      const genreId = '2';
      const genreEntity: GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(bookService, 'addGenreToBook').mockRejectedValueOnce({
        message: 'Book not found',
        status: HttpStatus.NOT_FOUND,
      });

      await expect(bookController.addGenreToBook(bookId, genreEntity)).rejects.toEqual({
        message: 'Book not found',
        status: HttpStatus.NOT_FOUND,
      });
      expect(bookService.addGenreToBook).toHaveBeenCalledWith(bookId, genreEntity);
    });
  });

  describe('removeGenreFromBook', () => {
    it('should remove a genre from a book', async () => {
      const bookId = '1';
      const genreId = '2';
      const updatedBook: BookEntity = {
        id: '1',
        name: 'banana',
        author: 'banana',
        description: 'muitas bananas',
        value: 60.0,
        state: 'AVAILABLE',
        createdAt: new Date(),
        createdBy: null,
        genreList: [],
      };
      const genreEntity: GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(bookService, 'removeGenreFromBook').mockResolvedValueOnce(updatedBook);

      const result = await bookController.removeGenreFromBook(bookId, genreEntity);

      expect(bookService.removeGenreFromBook).toHaveBeenCalledWith(bookId, genreEntity);

      expect(result).toEqual(updatedBook);
    });

    it('should handle a not found exception', async () => {
      const bookId = '1';
      const genreId = '2';
      const genreEntity: GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(bookService, 'removeGenreFromBook').mockRejectedValueOnce({
        message: 'Book not found',
        status: HttpStatus.NOT_FOUND,
      });

      await expect(bookController.removeGenreFromBook(bookId, genreEntity)).rejects.toEqual({
        message: 'Book not found',
        status: HttpStatus.NOT_FOUND,
      });

      expect(bookService.removeGenreFromBook).toHaveBeenCalledWith(bookId, genreEntity);
    });
  });
});
