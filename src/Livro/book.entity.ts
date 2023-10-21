import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Double, ManyToOne } from "typeorm"
@Entity('Book')
export class Book{
  @PrimaryGeneratedColumn()
  id:number;
  
  @Column()
  name: string;
  @Column()
  description: string;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToMany()
  idGenre:number;
  @Column()
  author:string;
  @Column()
  state:string;
  @Column()
  value:Double;
  //Alguma coisa precisa ser feita aqui!!!!
  @ManyToOne()
  idAdmin:number;



}