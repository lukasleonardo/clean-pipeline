import { IsPositive, IsString } from "class-validator";
import { GenreEntity } from "../../genre/entities/genre.entity";


export class CreateBookDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  author: string;
  @IsPositive()
  value: number;

  genreId:GenreEntity

}
