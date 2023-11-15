import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { mock } from 'jest-mock-extended'
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

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
  let genreController: GenreController;
  let genreService: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: mockRepository,
        }],
    }).compile();

    genreController = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService)

  });

  it('should be defined', () => {
    expect(genreController).toBeDefined();
    expect(genreService).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre', async () => {
      const createGenreDto: CreateGenreDto = {
        name: 'Fantasy',
      };

      const mockGenre: GenreEntity = {
        id: '1',
        name: 'Fantasy',
      };

      jest.spyOn(genreService, 'create').mockResolvedValueOnce(mockGenre);

      const result = await genreController.create(createGenreDto);

      expect(genreService.create).toHaveBeenCalledWith(createGenreDto);
      expect(result).toEqual(mockGenre);
    });

    it('should handle duplicate genre error', async () => {
      const createGenreDto: CreateGenreDto = {
        name: 'Fantasy',
      };

      jest.spyOn(genreService, 'create').mockRejectedValueOnce(
        new HttpException(
          { message: 'Input data validation failed', error: { genre: 'genre already exists in table genre' } },
          HttpStatus.BAD_REQUEST,
        ),
      );

      await expect(genreController.create(createGenreDto)).rejects.toThrowError(
        new HttpException(
          { message: 'Input data validation failed', error: { genre: 'genre already exists in table genre' } },
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(genreService.create).toHaveBeenCalledWith(createGenreDto);
    });
  })


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
  });
});


