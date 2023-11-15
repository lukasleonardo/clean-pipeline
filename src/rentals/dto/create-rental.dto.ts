import { BookEntity } from "../../book/entities/book.entity";
import { UserEntity } from "../../user/entities/user.entity";

export class CreateRentalDto {
  expiratedLoanDate: Date;
  user: UserEntity;
  book: BookEntity;

}
