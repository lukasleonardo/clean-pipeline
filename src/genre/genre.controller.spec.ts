import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { mock } from 'jest-mock-extended'
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { JwtService } from '@nestjs/jwt';

const repositoryMock = mock<Repository<GenreEntity>>()

export const getConnection = jest.fn().mockReturnValue({
  getRepository: () => repositoryMock,
  getConnection: () => Repository,
});

const newGenreEntity = new GenreEntity()
newGenreEntity.name = 'Drama'

const mockRepository = {
  create: jest.fn().mockResolvedValue(newGenreEntity),
  remove: jest.fn().mockResolvedValue({
    message: 'Item removed successfully',
    status: HttpStatus.OK,
  })
}
describe('GenreController', () => {
  let jwtService:JwtService
  let genreController: GenreController;
  let genreService: GenreService;
  let userService:UserService;
  let authService:AuthService;
  let userRepository: Repository<UserEntity>
  let bookRepository: Repository<BookEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: mockRepository,
        },{
          provide:getRepositoryToken(UserEntity),  
          useClass: Repository
        },{
          provide:getRepositoryToken(BookEntity),  
          useClass: Repository,
        },UserService,AuthService, JwtService],
    }).compile();
    jwtService = module.get<JwtService>(JwtService)
    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    genreController = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService)
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));

  });

  it('should be defined', () => {
    expect(genreController).toBeDefined();
  });

  describe('create',()=>{  
    it('should return a genre entity successfuly', async()=>{
      const mockDto: CreateGenreDto = {  name: 'Drama'}
      const result = await genreController.create(mockDto)
      expect(result).toEqual(newGenreEntity)
      expect(typeof result).toEqual('object')
    })
  })

  describe('remove', ()=>{
    it('should remove successfuly a genre entity', async()=>{     
      const mockDto: CreateGenreDto = {  name: 'Drama'}
      const temp = await genreController.create(mockDto)
      const existingMockId= temp.id
      const expected = JSON.stringify( 
        {
          message: 'Item removed successfully',
          status: 200,
        })
      const result = await genreController.remove(existingMockId)
      expect(JSON.stringify(result)).toBe(expected)
    })
  })
 });


