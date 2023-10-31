import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { BookEntity } from "../../book/entities/book.entity"

@Entity('user')
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

@Column({default:'USER'})
isAdmin:string
@Column({default:'DISPONIVEL'})
state: string

@OneToOne(() => BookEntity)
@JoinColumn()
idFavoritos: BookEntity[]
}


