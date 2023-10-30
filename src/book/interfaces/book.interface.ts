import { Double } from "typeorm";
import { GenreEntity } from "../../genre/entities/genre.entity";
import { User } from "../../user/entities/user.entity";


export interface IBook {
  id:number;
  name: string;
  description: string;
  idGenre:GenreEntity[];
  author:string;
  state:string;
  value:Double;
  idUser:User;
}
