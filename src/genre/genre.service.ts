import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IGenreService } from './interfaces/genreService.interface';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService implements IGenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>
  ) { }

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    const { name } = createGenreDto;
    const genre = await this.genreRepository.findOneBy({ name: name });
    if (genre) {
      const error = { genre: 'genre already exists in table genre' };
      throw new HttpException(
        { message: 'Input data validation failed', error },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newGenre = new GenreEntity();
    newGenre.name = name;
    const savedGenre = await this.genreRepository.save(newGenre);
    return savedGenre;
  }

  async remove(id: string) {
    const genre = await this.genreRepository.findOneBy({ id });
    if (genre) {
      await this.genreRepository.delete(genre.id);
      const status = {
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      };
      return status;
    } else {
      throw new HttpException(
        { message: 'Genre not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
