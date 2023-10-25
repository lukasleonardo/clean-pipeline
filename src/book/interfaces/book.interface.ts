import { Admin } from "src/admin/entities/admin.entity";
import { Genre } from "src/genre/entities/genre.entity";
import { Double } from "typeorm";

export interface IBook {
  id:number;
  name: string;
  description: string;
  idGenre:Genre;
  author:string;
  state:string;
  value:Double;
  idAdmin:Admin;
}
