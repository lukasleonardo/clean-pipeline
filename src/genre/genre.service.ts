import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IGenreService } from './interfaces/genreService.interface';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class GenreService implements IGenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    // Validação de Genero já existente
    const { name } = createGenreDto;
    const qb = await this.entityManager
      .getRepository(GenreEntity)
      .createQueryBuilder('genre')
      .where('Genre.name === :name', { name });

    const user = await qb.getOne();
    if (user) {
      const _errors = { genre: 'genre already exists in table genre' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    //***************

    const newGenre = new GenreEntity();
    newGenre.name = name;

    const errors = await validate(newGenre);
    if (errors.length > 0) {
      const _errors = { renre: 'Genre input is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedGenre = await this.entityManager.save(newGenre);
      return savedGenre;
    }
  }

  async remove(id: number) {
    await this.genreRepository.delete(id);
    return `This action removes a #${id} genre`;
  }
}
