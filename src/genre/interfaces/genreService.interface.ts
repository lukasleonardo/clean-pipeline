import { CreateGenreDto } from "../dto/create-genre.dto";
import { IGenre } from "./genre.interface";

export interface IGenreService {

  create(createGenreDto:CreateGenreDto):Promise<IGenre>;
  remove(id:number)
}