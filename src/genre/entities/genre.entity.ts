import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IGenre } from "../interfaces/genre.interface";

@Entity('genre')
export class GenreEntity implements IGenre{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
