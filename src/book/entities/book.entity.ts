import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Double, ManyToOne, JoinTable} from "typeorm"
import { IBook } from "../interfaces/book.interface";
import { GenreEntity } from "../../genre/entities/genre.entity";
import { User } from "../../user/entities/user.entity";


@Entity('Book')
export class Book implements IBook{
  @PrimaryGeneratedColumn()
  id:number;
  
  @Column({length:50})
  name: string;
  @Column({length:3000})
  description: string;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToMany(() => GenreEntity, (GenreEntity)=> GenreEntity.id)
  @JoinTable()
  idGenre:GenreEntity[];
  @Column({length:50})
  author:string;
  @Column({length:50})
  state:string;
  @Column()
  value:Double;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToOne(type => User)
  @JoinTable()
  idUser:User;

}
