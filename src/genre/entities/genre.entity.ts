import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IGenre } from '../interfaces/genre.interface';
import { BookEntity } from '../../book/entities/book.entity';
//import { v4 as uuidV4 } from 'uuid';

@Entity('genre')
export class GenreEntity implements IGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;


  constructor() {
  }
}
