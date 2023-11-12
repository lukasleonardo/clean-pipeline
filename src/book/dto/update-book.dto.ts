import { IsEnum, IsPositive, IsString } from "class-validator";
import { objectState } from "../../shared/global.enum";
import { GenreEntity } from "../../genre/entities/genre.entity";

export class UpdateBookDto {
  
  name?: string;
  
  description?: string;
  
  author?: string;
  
  value?: number;
  

}
