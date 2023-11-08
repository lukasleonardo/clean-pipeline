import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IGenre } from '../interfaces/genre.interface';
//import { v4 as uuidV4 } from 'uuid';

@Entity('genre')
export class GenreEntity implements IGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 300 })
  name: string;

  constructor() {
  }
}
