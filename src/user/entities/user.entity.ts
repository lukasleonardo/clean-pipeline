import { Column, PrimaryGeneratedColumn } from "typeorm"
import { IUser } from "../interfaces/user.interface"

export class User implements IUser {
@PrimaryGeneratedColumn()  
Id:number
@Column()
nome:string
@Column()
login: string
@Column()
senha: string
@Column()
province: string
@Column()
idFavoritos: []
@Column()
state: string
@Column()
Cpf:string
@Column()
isAdmin:boolean
}
