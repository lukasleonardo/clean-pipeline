import { Injectable } from '@nestjs/common';
import { IGenreService } from './interfaces/genreService.interface';

@Injectable()
export class GenreService implements IGenreService {
  create(createGenreDto: CreateGenreDto) {
    return 'This action adds a new genre';
  }

  findAll() {
    return `This action returns all genre`;
  }

  findOne(id: number) {
    // LOGICA DO CARALHO
    return `This action returns a #${id} genre`;
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
