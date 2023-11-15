import { BookEntity } from '../../book/entities/book.entity';

export interface IUser {
  id: string;
  name: string;
  username: string;
  password: string;
  province: string;
  cpf: string;
  state: string;
  role: string;
  favoriteBooks: BookEntity[];
}


