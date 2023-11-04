import { CreateGenreDto } from '../dto/create-genre.dto';
import { GenreEntity } from '../entities/genre.entity';

export interface IGenreService {
  create(createGenreDto: CreateGenreDto): Promise<GenreEntity>;
  remove(id: string);
}
