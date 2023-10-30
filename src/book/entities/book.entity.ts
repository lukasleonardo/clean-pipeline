import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, JoinColumn} from "typeorm"
import { IBook } from "../interfaces/book.interface";
import { GenreEntity } from "../../genre/entities/genre.entity";
import { UserEntity } from "../../user/entities/user.entity";



@Entity('Book')
export class Book implements IBook{
  idUser: UserEntity;
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
  @Column('double precision')
  value:number;
  //Alguma coisa precisa ser feita aqui!!!!

  @OneToOne( () => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  loanDate:Date

  @Column()
  expiratedLoanDate:Date

  @OneToOne( () => UserEntity)
  @JoinColumn()
  createdBy:UserEntity;

}
