import { Timestamp } from 'typeorm';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { UserEntity } from '../../user/entities/user.entity';

export interface IBook {
  id: string;
  name: string;
  description: string;
  author: string;
  value: number;
  state: string;

  genre: GenreEntity[];
  // createdBy: UserEntity;
  createdAt: Timestamp;
}
