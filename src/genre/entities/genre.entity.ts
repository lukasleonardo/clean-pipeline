import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IGenre } from "../interfaces/genre.interface";
@Entity('Genre')
export class Genre implements IGenre{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
