
import { GenreEntity } from "../../genre/entities/genre.entity";
import { UserEntity } from "../../user/entities/user.entity";


export interface IBook {
  id:number;
  name: string;
  description: string;
  author:string;
  value:number;

  state:string;

  loanDate:Date;
  expiratedLoanDate:Date;

  idGenre:GenreEntity[];
  user: UserEntity;
  createdBy:UserEntity;
  createdAt:Date;

}
