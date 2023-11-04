import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IGenreService } from './interfaces/genreService.interface';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';


@Injectable()
export class GenreService implements IGenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    //private readonly entityManager: EntityManager,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    // Validação de Genero já existente

    //desestruturação de objeto
    const { name } = createGenreDto;
    const newGenre = new GenreEntity()
    newGenre.name = name

    // Verifica se já existe na tabela
    const genre = await this.genreRepository.findOneBy({name:name})
    if (genre) {
      const error = { genre: 'genre already exists in table genre' };
      throw new HttpException(
        { message: 'Input data validation failed', error },
        HttpStatus.BAD_REQUEST,
      );
      }

    const errors = await validate(newGenre);
    if (errors.length > 0) {
      const _errors = { genre: 'Genre input is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedGenre = await this.genreRepository.save(newGenre)
      return savedGenre;
    }
    
  }

  async remove(id: string) {
    await this.genreRepository.delete(id);
    return `This action removes a #${id} genre`;
  }
}
