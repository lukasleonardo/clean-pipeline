import { BookEntity } from '../../book/entities/book.entity';

export interface IUser {
  id: number;
  nome: string;
  login: string;
  password: string;
  province: string;
  cpf: string;
  fines: number;

  state: string;
  isAdmin: string;
  idFavoritos: BookEntity[];
}
