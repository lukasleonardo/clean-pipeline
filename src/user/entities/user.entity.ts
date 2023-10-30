import { Column, PrimaryGeneratedColumn } from "typeorm"
import { IUser } from "../interfaces/user.interface"

export class User implements IUser {
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
@Column()
idFavoritos: []
@Column({length:20})
state: string
@Column({length:20})
Cpf:string
@Column()
isAdmin:boolean
}
