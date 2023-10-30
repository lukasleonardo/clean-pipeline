import { Column, JoinColumn, OneToOne } from "typeorm"
import { BaseUserEntity } from "./baseUser.Entity"
import { Book } from "../../book/entities/book.entity"

export class UserEntity extends BaseUserEntity {

  
@Column()
state: string
@OneToOne(type => Book, user => user)
@JoinColumn()
book: Book
@Column()
idFavoritos: []
}
