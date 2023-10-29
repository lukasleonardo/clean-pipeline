import { Double } from "typeorm";
import { Genre } from "../../genre/entities/genre.entity";
import { User } from "../../user/entities/user.entity";


export interface IBook {
  id:number;
  name: string;
  description: string;
  idGenre:Genre[];
  author:string;
  state:string;
  value:Double;
  idUser:User;
}
