import { BookEntity } from '../../book/entities/book.entity';

export interface IUser {
  Id: number;
  name: string;
  username: string;
  password: string;
  province: string;
  cpf: string;
  fines: number;
  state: string;
  isAdmin: string;
  favoriteBooks: BookEntity[];
}


