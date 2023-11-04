import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IGenre } from '../interfaces/genre.interface';
import { v4 as uuidV4 } from 'uuid';

@Entity('genre')
export class GenreEntity implements IGenre {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  name: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

