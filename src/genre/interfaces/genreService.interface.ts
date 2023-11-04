import { CreateGenreDto } from '../dto/create-genre.dto';


export interface IGenreService {
  create(createGenreDto: CreateGenreDto);
  remove(id: string);
}
