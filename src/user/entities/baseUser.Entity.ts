import { Column, PrimaryGeneratedColumn } from "typeorm"
import { IBaseUser } from "../interfaces/baseUser.interface"

export class BaseUserEntity implements IBaseUser {
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

}
