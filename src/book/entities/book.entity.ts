import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Double, ManyToOne, JoinTable} from "typeorm"
import { IBook } from "../interfaces/book.interface";
import { Genre } from "../../genre/entities/genre.entity";
import { User } from "../../user/entities/user.entity";


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
  @JoinTable()
  idGenre:Genre[];
  @Column()
  author:string;
  @Column()
  state:string;
  @Column()
  value:Double;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToOne(type => User)
  @JoinTable()
  idUser:User;

}
