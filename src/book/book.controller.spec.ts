import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Request } from 'express';
import { CreateBookDto } from './dto/create-book.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { objectState } from '../shared/global.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { GenreEntity } from '../genre/entities/genre.entity';
import { UserEntity } from '../user/entities/user.entity';

describe('BookController', () => {
  let bookRepository: Repository<BookEntity>
  let genreRepository: Repository<GenreEntity>
  let userRepository: Repository<UserEntity>
  let bookController: BookController;
  let authService: AuthService;
  let bookService: BookService;
  let userService:UserService
  let jwtService:JwtService

  beforeEach(async () => {
   
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService,{
        provide:getRepositoryToken(BookEntity),  
        useClass: Repository,
      },{
        provide:getRepositoryToken(GenreEntity),  
        useClass: Repository
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      },{ provide: AuthService, useValue: {verifyToken: jest.fn().mockResolvedValueOnce({ username: 'adminUser' })} }, UserService, JwtService],
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
      const book = {
        id: faker.string.uuid(),
        name: 'Mocked Book',
        author: 'Mocked Author',
        description: 'Mocked Description',
        value:100,
        genrelist:[{id:'1',name:'Ação'}],
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
      // Mock do token e usuário
      const mockToken = 'mockedToken';
      const mockUsername = 'adminUser';

      // Mock do objeto CreateBookDto
      const mockCreateBookDto: CreateBookDto = {
        // ajuste os campos conforme necessário
        name: 'Mocked Book',
        author: 'Mocked Author',
        description: 'Mocked Description',
        value:100,
        genres:[{id:'1',name:'Ação'}]
      };

      // Mock do request
      const mockRequest: Partial<Request> = {
        // ajuste conforme necessário
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      };
      
      //const authService = new AuthService(userService,jwtService);

      // Mock das funções necessárias
      authService.verifyToken = jest.fn().mockResolvedValueOnce({ username: mockUsername });
      bookService.create = jest.fn().mockResolvedValueOnce(book)
      // jest.spyOn(bookService, 'create').mockRejectedValueOnce(book)

      // Chame a função do controller
      const result = await bookController.create(mockCreateBookDto, mockRequest as Request);

      // Verifique se as funções foram chamadas corretamente
      expect(authService.verifyToken).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();

      // Verifique o resultado da função
      expect(result).toEqual(book);
    });
  })
});



// describe('create',()=>{
//     it('',()=>{
      
//     })
//   })