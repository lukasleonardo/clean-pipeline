import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Book } from "../../book/entities/book.entity"

export class UserEntity {

@PrimaryGeneratedColumn()  
Id:number
@Column({length:50})
nome:string
@Column({length:50})
login: string
@Column({length:50})
senha: string
@Column({length:50})
province: string
@Column({length:20})
Cpf:string
@Column('double precision')
fines:number

@Column({default:false})
isAdmin:boolean
@Column()
state: string
@OneToOne(() => Book)
@JoinColumn()
book: Book[]
@Column()
idFavoritos: []

}


