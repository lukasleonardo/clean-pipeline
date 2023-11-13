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
import { randomInt } from 'crypto';

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
        useClass: Repository
      },{
        provide:getRepositoryToken(GenreEntity),  
        useClass: Repository
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      }],
      
    }).compile();
    
    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  xdescribe('Tests for Find All function',()=>{
     it('it should return all books', async ()=>{
      const livrosMock = faker.helpers.multiple(generateMockBookEntity, {count: 4})
      //bookMock
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);
      // Chama a função findAll
      const resultado = await bookService.findAll(); 
      // Verifica se o resultado é igual ao mock de livros
      expect(resultado).toEqual(livrosMock);
      // Verifica se o método find do mock foi chamado uma vez
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })

    it('it should return an empty array', async ()=>{
      const livrosMock = []
      // Substitua o repositório real pelo mock no serviço
      //bookMock
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);
  
      // Chama a função findAll
      const resultado = await bookService.findAll();
  
      // Verifica se o resultado é igual ao mock de livros
      expect(resultado).toEqual(livrosMock);
  
      // Verifica se o método find do mock foi chamado uma vez
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })
  })


  xdescribe('Tests for Find One function',()=>{
    it('it should return one book', async()=>{
          // Configuração do mock para o repositório
    const livroMock= generateMockBookEntity()
    jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(livroMock);

    // Chama a função findOne
    const resultado = await bookService.findOne(livroMock.id);

    // Verifica se o resultado é igual ao mock do livro
    expect(resultado).toEqual(livroMock);
    
    // Verifica se o método findOne do mock foi chamado uma vez com o ID correto
    expect(bookRepository.findOne).toHaveBeenCalledWith({ id: livroMock.id });
    expect(bookRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('deve lançar uma exceção se o livro não for encontrado', async () => {
    // Configuração do mock para o repositório retornando null (livro não encontrado)
    jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);

    // Chama a função findOne
    await expect(bookService.findOne('2')).rejects.toThrowError(
      new HttpException(
        { message: 'No book found with this id' },
        HttpStatus.NOT_FOUND,
      ),
    );

    // Verifica se o método findOne do mock foi chamado uma vez com o ID correto
    expect(bookRepository.findOne).toHaveBeenCalledWith({ id: '2' });
    expect(bookRepository.findOne).toHaveBeenCalledTimes(1);

    })
  })

  describe('Tests for find by genre function',()=>{
    function generateMockGenreEntity(){
      let number = faker.number.int({min:1, max:9}).toString()
      return{
        id: number,
        name: `ação ${number}`,
      }
    }

    function generateMockBookEntity(){
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
          isAdmin: "ADMIN",
          state: "INDISPONIVEL",
          favoriteBooks: []
        }}
    }

    it('it should return books with same genre', async ()=>{
      const genreMock = faker.number.int({max:3}).toString()


      const livrosMock = faker.helpers.multiple(generateMockBookEntity, {count: 40})
      //bookMock
      jest.spyOn(bookRepository, 'find').mockResolvedValueOnce(livrosMock);
      // Chama a função findAll
      const resultado = await bookService.findByGenre(genreMock); 
      // Verifica se o resultado é igual ao mock de livros
      const book = livrosMock.filter(livro => livro.genreList.some(genre => genre.id === genreMock))
      const result = resultado.filter(livro => livro.genreList.some(genre => genre.id === genreMock))
     
      expect(result).toEqual(book);
      
      // Verifica se o método find do mock foi chamado uma vez
      expect(bookRepository.find).toHaveBeenCalledTimes(1);
    })
  })

 // livrosMock.filter(livro => livro.genreList.some(genre => genre.id === genreMock.id));
  
});

// describe('Tests for Find One function',()=>{
// })