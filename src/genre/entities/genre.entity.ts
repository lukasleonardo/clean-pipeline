import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IGenre } from '../interfaces/genre.interface';

@Entity('genre')
export class GenreEntity implements IGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

}
