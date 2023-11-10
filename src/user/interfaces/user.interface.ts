import { BookEntity } from '../../book/entities/book.entity';

export interface IUser {
  Id: number;
  name: string;
  login: string;
  password: string;
  province: string;
  cpf: string;
  fines: number;
  state: string;
  isAdmin: string;
  idFavoritos: BookEntity[];
}

export interface ILoginData {
  login: string;
  password: string;
}


