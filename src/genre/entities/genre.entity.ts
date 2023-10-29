import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IGenre } from "../interfaces/genre.interface";

@Entity('genre')
export class GenreEntity implements IGenre{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length:50})
  name: string;
}
