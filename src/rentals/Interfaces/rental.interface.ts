import { UserEntity } from "../../user/entities/user.entity";
import { BookEntity } from "../../book/entities/book.entity";

export interface IRental{

  id:string
  loanDate: Date; 
  expiratedLoanDate: Date;
  fines: number;
  user: UserEntity;
  book: BookEntity;

}
