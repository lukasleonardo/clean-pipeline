import { ApiProperty } from "@nestjs/swagger";
import { BookEntity } from "../../book/entities/book.entity";
import { UserEntity } from "../../user/entities/user.entity";

export class CreateRentalDto {
  @ApiProperty()
  expiratedLoanDate: Date;
  @ApiProperty()
  user: UserEntity;
  @ApiProperty()
  book: BookEntity;

}
