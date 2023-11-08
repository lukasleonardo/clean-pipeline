import { IsEnum, IsPositive, IsString } from "class-validator";
import { objectState } from "../../shared/global.enum";
import { GenreEntity } from "../../genre/entities/genre.entity";

export class UpdateBookDto {
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
