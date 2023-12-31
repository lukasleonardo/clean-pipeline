import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {faker } from '@faker-js/faker'
import { generateMockBookEntity } from '../../test/mocks/bookGenerator.mock';
import { GenreEntity } from '../genre/entities/genre.entity';
import { UserEntity } from '../user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { generateMockGenreEntity } from '../../test/mocks/genreGenerator.mock';
import { objectState } from '../shared/global.enum';
import { CreateBookDto } from './dto/create-book.dto';
import { generateMockUserEntity } from '../../test/mocks/userGenerator.mock';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Repository<BookEntity>
  let genreRepository: Repository<GenreEntity>
  let userRepository: Repository<UserEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService,
        {
        provide:getRepositoryToken(BookEntity),  
        useClass: Repository,
      },{
        provide:getRepositoryToken(GenreEntity),  
        useClass: Repository
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      },
     ]
    }).compile();
    
    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('FindAll',()=>{
     it('it should return all books', async ()=>{
      const livrosMock:BookEntity[] = faker.helpers.multiple(generateMockBookEntity, {count: 4})
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);
      const resultado = await bookService.findAll(); 

      expect(resultado).toEqual(livrosMock);
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })

    it('it should return an empty array', async ()=>{
      const livrosMock = []
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);
      const resultado = await bookService.findAll();
      expect(resultado).toEqual(livrosMock);
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })
  })


  describe('FindOne',()=>{
    it('it should return one book', async()=>{
    const livroMock:BookEntity= generateMockBookEntity()
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(livroMock);
    const resultado = await bookService.findOne(livroMock.id);

    expect(resultado).toEqual(livroMock);
    expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: livroMock.id });
    expect(bookRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('deve lançar uma exceção se o livro não for encontrado', async () => {
    jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
    await expect(bookService.findOne('2')).rejects.toThrowError(
      new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      ),
    );
    expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: '2' });
    expect(bookRepository.findOneBy).toHaveBeenCalledTimes(1);
    })
  })

  describe('FindByGenre',()=>{
    function generateMockGenreEntity(){
      let number = faker.number.int({min:1, max:9}).toString()
      return{
        id: number,
        name: `ação ${number}`,
      }
    }

    function generateMockBookEntity():BookEntity{
      return {
        id: faker.string.uuid(),
        name: faker.lorem.words({min:3,max:5}),
        description: faker.lorem.text(),
        author: faker.person.fullName(),
        state:faker.helpers.enumValue(objectState),
        value: faker.number.float({precision:2, min: 40.00, max:500.00}),
        createdAt: faker.date.anytime(),
        genreList: faker.helpers.multiple(generateMockGenreEntity, {count:3}),
        createdBy: {
          id: "1",
          name: "Usuario",
          username: "admin",
          password: "password",
          province: "province",
          cpf: "99999",
          role: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
        }}
    }

    it('it should return books with same genre', async ()=>{
      const genreMock:string = faker.number.int({max:3}).toString()
      const livrosMock: BookEntity[] = faker.helpers.multiple(generateMockBookEntity, {count: 40})

      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);

      const resultado = await bookService.findByGenre(genreMock); 
      const book = livrosMock.filter(livro => livro.genreList.some(genre => genre.id === genreMock))
      const result = resultado.filter(livro => livro.genreList.some(genre => genre.id === genreMock))
     
      expect(result).toEqual(book);
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })
  })

  
  describe('setBookState', () => {
    it('should set book state to indisponivel when it is disponivel', async () => {
      const mockBook:BookEntity = {
        id: faker.string.uuid(),
        name: faker.lorem.words({min:3,max:5}),
        description: faker.lorem.text(),
        author: faker.person.fullName(),
        state:objectState.disponivel,
        value: faker.number.float({precision:2, min: 40.00, max:500.00}),
        createdAt: faker.date.anytime(),
        genreList: [],
        createdBy: {
          id: "1",
          name: "Usuario",
          username: "admin",
          password: "password",
          province: "province",
          cpf: "99999",
          role: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
        },
      };
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(mockBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(mockBook);

      const resultado = await bookService.setBookState(mockBook.id);
 
      expect(resultado.state).toBe(objectState.indisponivel);
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({id:mockBook.id});
      expect(bookRepository.save).toHaveBeenCalledWith(resultado);
    });

    it('should set book state to disponivel when it is indisponivel', async () => {
      const mockBook:BookEntity = {
        id: faker.string.uuid(),
        name: faker.lorem.words({min:3,max:5}),
        description: faker.lorem.text(),
        author: faker.person.fullName(),
        state:objectState.indisponivel,
        value: faker.number.float({precision:2, min: 40.00, max:500.00}),
        createdAt: faker.date.anytime(),
        genreList: [],
        createdBy: {
          id: "1",
          name: "Usuario",
          username: "admin",
          password: "password",
          province: "province",
          cpf: "99999",
          role: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
        },
      };
      
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(mockBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(mockBook);
      const resultado = await bookService.setBookState(mockBook.id);
  
      expect(resultado.id).toBe(mockBook.id);
      expect(resultado.state).toBe(objectState.disponivel);
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({id:mockBook.id});
      expect(bookRepository.save).toHaveBeenCalledWith(resultado);

    });

    it('should throw 404 error if book is not found', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(bookRepository, 'save').mockRejectedValueOnce(null);

      await expect(bookService.setBookState('invalidId')).rejects.toThrow(
        new HttpException(
          { message: 'No book found with this id' },
          HttpStatus.NOT_FOUND,
        ),
      ); 

      expect(bookRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Remove',()=>{
    it('should remove a book successfuly',async()=>{
      const mockBook:BookEntity = generateMockBookEntity()
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(mockBook);
      jest.spyOn(bookRepository, 'delete').mockReturnThis();

      const resultado = await bookService.remove(mockBook.id);
      const expected = ({
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      })

      expect(resultado).toEqual(expected)
      expect(bookRepository.delete).toHaveBeenCalled();
    }) 
    it('should throw 404 error if book is not found', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(bookRepository, 'delete').mockRejectedValueOnce(null);

      await expect(bookService.remove('invalidId')).rejects.toThrow(
        new HttpException(
          { message: 'book not found' },
          HttpStatus.NOT_FOUND,
          )
        )

      expect(bookRepository.delete).not.toHaveBeenCalled();
      }) 
  });


  describe('create', () => {
    const genres:GenreEntity[] = faker.helpers.multiple(generateMockGenreEntity, {count:2})
    const adminUser:UserEntity = generateMockUserEntity()
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        name: 'Test Book',
        description: 'Test Description',
        author: 'Test Author',
        value: 10,
        genres: genres,
      };

      const savedBook = new BookEntity();
      savedBook.id = '1';
      savedBook.name = 'Test Book';
      savedBook.description = 'Test Description';
      savedBook.author = 'Test Author';
      savedBook.value = 10;
      savedBook.genreList = genres;
      savedBook.createdBy = adminUser;

      const username = adminUser.username;
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(adminUser);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(savedBook);
      
      const result = await bookService.create(createBookDto, username);
      expect(result).toEqual(savedBook);
    });
  });


  describe('update', () => {
    it('should update an existing book', async () => {
      const id = '1';
      const updateBookDto: UpdateBookDto = {
        name: 'Updated Book',
        description: 'Updated Description',
        author: 'Updated Author',
        value: 20,
      };

      const existingBook = new BookEntity();
      existingBook.id = id;
      existingBook.name = 'Old Book';
      existingBook.description = 'Old Description';
      existingBook.author = 'Old Author';
      existingBook.value = 10;

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(existingBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce(existingBook);

      const result = await bookService.update(id, updateBookDto);

      expect(result.name).toBe(updateBookDto.name);
      expect(result.description).toBe(updateBookDto.description);
      expect(result.author).toBe(updateBookDto.author);
      expect(result.value).toBe(updateBookDto.value);
      expect(bookRepository.save).toHaveBeenCalledWith(existingBook);
    });

    it('should throw a 404 error if the book does not exist', async () => {
      const id = '1';
      const updateBookDto: UpdateBookDto = {
        name: 'Updated Book',
        description: 'Updated Description',
        author: 'Updated Author',
        value: 20,
      };

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(bookService.update(id, updateBookDto)).rejects.toThrow(
        new HttpException(
          { message: 'Book not found', error: { book: 'book does not exist' } },
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw a validation error if input data is not valid', async () => {
      const id = '1';
      const updateBookDto: UpdateBookDto = {
        name: '',
        description: 'Updated Description',
        author: 'Updated Author',
        value: 20,
      };

      const existingBook = new BookEntity();
      existingBook.id = id;
      const exception = new HttpException(
        { message: 'Input data validation failed', error: { book: 'book input is not valid.' } },
        HttpStatus.BAD_REQUEST,
      )
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(existingBook);
      jest.spyOn(bookRepository, 'save').mockRejectedValueOnce(exception);
      await expect(bookService.update(id, updateBookDto)).rejects.toThrow(exception);
    });
  });

  describe('addGenreToBook', () => {
    const bookId = '1';
    const genreId = '2';
    const book:BookEntity = {
      id: bookId,
      name: faker.lorem.words({min:3,max:5}),
      description: faker.lorem.text(),
      author: faker.person.fullName(),
      state:faker.helpers.enumValue(objectState),
      value: faker.number.float({precision:2, min: 40.00, max:500.00}),
      createdAt: faker.date.anytime(),
      genreList: [],
      createdBy: {
        id: "1",
        name: "Usuario",
        username: "admin",
        password: "password",
        province: "province",
        cpf: "99999",
        role: "ADMIN",
        state: "INDISPONIVEL",
        favoriteBooks: []
      },
    };
    it('should add a genre to an existing book', async () => {     
      const genre:GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValueOnce(genre);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce({ ...book, genreList: [genre] });

      const result = await bookService.addGenreToBook(bookId, genre);

      expect(result.genreList).toContainEqual(genre);
      expect(bookRepository.save).toHaveBeenCalledWith({ ...book, genreList: [genre] });
    });

    it('should not add a genre if it already exists in the book', async () => {
      const book:BookEntity = {        
        id: bookId,
        name: faker.lorem.words({min:3,max:5}),
        description: faker.lorem.text(),
        author: faker.person.fullName(),
        state:faker.helpers.enumValue(objectState),
        value: faker.number.float({precision:2, min: 40.00, max:500.00}),
        createdAt: faker.date.anytime(),
        genreList: [{ id: genreId, name: 'Fantasy' }],
        createdBy: {
          id: "1",
          name: "Usuario",
          username: "admin",
          password: "password",
          province: "province",
          cpf: "99999",
          role: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
      }       
    };

      const genre = {
        id: genreId,
        name: 'Fantasy',
      };
      genreRepository.findOneBy = jest.fn()
      bookRepository.save = jest.fn()
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
      jest.spyOn(bookService, 'addGenreToBook').mockResolvedValueOnce(book);

      const result = await bookService.addGenreToBook(bookId, genre);
      expect(result).toEqual(book);
      expect(bookRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a 404 error if the book is not found', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(bookService.addGenreToBook('2', { id: genreId, name: 'Fantasy' })).rejects.toThrow(
        new HttpException('Book not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an internal server error for invalid input data', async () => {

      jest.spyOn(bookRepository, 'findOneBy').mockRejectedValueOnce(new Error('invalid input data'));

      await expect(bookService.addGenreToBook(bookId, { id: genreId, name: 'Fantasy' })).rejects.toThrow(
        new HttpException('invalid input data', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });


  describe('removeGenreFromBook', () => {
    const bookId = '1';
    const genreId = '2';
    const book:BookEntity = {
      id: bookId,
      name: faker.lorem.words({min:3,max:5}),
      description: faker.lorem.text(),
      author: faker.person.fullName(),
      state:faker.helpers.enumValue(objectState),
      value: faker.number.float({precision:2, min: 40.00, max:500.00}),
      createdAt: faker.date.anytime(),
      genreList: [],
      createdBy: {
        id: "1",
        name: "Usuario",
        username: "admin",
        password: "password",
        province: "province",
        cpf: "99999",
        role: "ADMIN",
        state: "INDISPONIVEL",
        favoriteBooks: []
      },
    };
    it('should remove a genre from an existing book', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
      jest.spyOn(bookRepository, 'save').mockResolvedValueOnce({ ...book, genreList: [] });
      const result = await bookService.removeGenreFromBook(bookId, { id: genreId, name: 'Fantasy' });

      expect(result.genreList).toEqual([]);
      expect(bookRepository.save).toHaveBeenCalledWith({ ...book, genreList: [] });
    });

    it('should not modify the genre list if the genre is not found in the book', async () => {
      const book:BookEntity = {        
          id: bookId,
          name: faker.lorem.words({min:3,max:5}),
          description: faker.lorem.text(),
          author: faker.person.fullName(),
          state:faker.helpers.enumValue(objectState),
          value: faker.number.float({precision:2, min: 40.00, max:500.00}),
          createdAt: faker.date.anytime(),
          genreList: [{ id: '3', name: 'Science Fiction' }],
          createdBy: {
            id: "1",
            name: "Usuario",
            username: "admin",
            password: "password",
            province: "province",
            cpf: "99999",
            role: "ADMIN",
            state: "INDISPONIVEL",
            favoriteBooks: []
        }       
      };
      
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(book);
      jest.spyOn(bookService, 'removeGenreFromBook').mockResolvedValueOnce(book);
      bookRepository.save = jest.fn()

      const result = await bookService.removeGenreFromBook(bookId, { id: genreId, name: 'Fantasy' });
      expect(result).toEqual(book);
      expect(bookRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a 404 error if the book is not found', async () => {
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(bookService.removeGenreFromBook(bookId, { id: genreId, name: 'Fantasy' })).rejects.toThrow(
        new HttpException('Book not found', HttpStatus.NOT_FOUND),
      );
    });
  });
})
