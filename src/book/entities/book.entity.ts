
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Double, ManyToOne} from "typeorm"
import { Genre } from "src/genre/entities/genre.entity";
import { IBook } from "../interfaces/book.interface";
import { Admin } from "src/admin/entities/admin.entity";
@Entity('Book')
export class Book implements IBook{
  @PrimaryGeneratedColumn()
  id:number;
  
  @Column()
  name: string;
  @Column()
  description: string;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToMany(type => Genre)
  idGenre:Genre;
  @Column()
  author:string;
  @Column()
  state:string;
  @Column()
  value:Double;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToOne(type => Admin)
  idAdmin:Admin;

}
