
import { GenreEntity } from "../../genre/entities/genre.entity";
import { UserEntity } from "../../user/entities/user.entity";


export interface IBook {
  id:number;
  name: string;
  description: string;
  idGenre:GenreEntity[];
  author:string;
  state:string;
  value:number;
  
  idUser:UserEntity;
  user: UserEntity;

  loanDate:Date;
  expiratedLoanDate:Date;

}
