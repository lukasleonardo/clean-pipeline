import { BookEntity } from "../../book/entities/book.entity";
import { RentalEntity } from "../entities/rental.entity";

export interface IRentalService {
  requestBook(userid:string, bookEntity: BookEntity):Promise<RentalEntity>
  retrieveAllFines():Promise<RentalEntity[]>
  findAllFromUser(userid: string):Promise<RentalEntity[]>
  applyFines()
  remove(id: string)
}