import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { GenreEntity } from './entities/genre.entity';
import { GenreController } from './genre.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationError, validate } from 'class-validator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../user/entities/user.entity';
import { BookEntity } from '../book/entities/book.entity';

jest.mock('class-validator');

describe('GenreService', () => {
  let jwtService:JwtService
  let genreController: GenreController;
  let genreService: GenreService;
  let userService:UserService;
  let authService:AuthService;
  let userRepository: Repository<UserEntity>
  let bookRepository: Repository<BookEntity>
  let genreRepository: Repository<GenreEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        GenreService,
        {
          provide:getRepositoryToken(UserEntity),  
          useClass: Repository
        },{
          provide:getRepositoryToken(BookEntity),  
          useClass: Repository,
        },{
          provide:getRepositoryToken(GenreEntity),  
          useClass: Repository,
        },UserService,JwtService,AuthService
      ],
    }).compile();

    genreController = module.get<GenreController>(GenreController);
    jwtService = module.get<JwtService>(JwtService)
    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    genreController = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService)
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    genreRepository = module.get<Repository<GenreEntity>>(getRepositoryToken(GenreEntity));

  });
  it('should be defined', () => {
    expect(genreService).toBeDefined();
    expect(genreController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new genre', async () => {
      const dto: CreateGenreDto = { name: 'genre1' };
      const genre: GenreEntity = { id: '1', name: 'genre1' };

      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValueOnce(undefined);
      jest.spyOn(genreRepository, 'save').mockResolvedValueOnce(genre);

      expect(await genreService.create(dto)).toEqual(genre);
    });
    it('should throw an error if genre already exists', async () => {
      const dto: CreateGenreDto = { name: 'genre1' };
      const genre: GenreEntity = { id: '1', name: 'genre1' };

      jest.spyOn(genreRepository, 'findOne').mockResolvedValueOnce(genre);

      await expect(genreService.create(dto)).rejects.toThrow();
    });
  });

  
  describe('remove', () => {
    it('should remove a genre', async () => {
      const genreId = '1';

      const mockGenre: GenreEntity = {
        id: genreId,
        name: 'Fantasy',
      };

      jest.spyOn(genreService, 'remove').mockResolvedValueOnce({ message: 'Item removed successfully', status: HttpStatus.OK });

      const result = await genreController.remove(genreId);

      expect(genreService.remove).toHaveBeenCalledWith(genreId);
      expect(result).toEqual({ message: 'Item removed successfully', status: HttpStatus.OK });
    });

    it('should handle genre not found error', async () => {
      const genreId = '1';

      jest.spyOn(genreService, 'remove').mockRejectedValueOnce(
        new HttpException(
          { message: 'Genre not found' },
          HttpStatus.BAD_REQUEST,
        ),
      );

      await expect(genreController.remove(genreId)).rejects.toThrowError(
        new HttpException(
          { message: 'Genre not found' },
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(genreService.remove).toHaveBeenCalledWith(genreId);
    });
  })



});
