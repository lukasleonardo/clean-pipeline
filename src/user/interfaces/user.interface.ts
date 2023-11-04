import { BookEntity } from '../../book/entities/book.entity';

export interface IUser {
  Id: number;
  nome: string;
  login: string;
  senha: string;
  province: string;
  Cpf: string;
  fines: number;

  state: string;
  isAdmin: string;
  idFavoritos: BookEntity[];
}
