import { BookEntity } from "../../book/entities/book.entity"
import { CreateUserDto } from "../dto/create-user.dto"
import { UpdateUserDto } from "../dto/update-user.dto"
import { UserEntity } from "../entities/user.entity"

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<UserEntity>
  findAll():Promise<UserEntity[]>
  findOne(username: string): Promise<UserEntity>
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>
  remove(id: string)
  setToAdmin(id: string): Promise<UserEntity>
  bookmarkBook(userId: string, bookEntity: BookEntity): Promise<UserEntity>
  removeBookmarkBook(userId:string, book: BookEntity): Promise<UserEntity>
  findAllBookmarked(userid: string): Promise<BookEntity[]>
}
