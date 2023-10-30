import { IsDefined, IsNotEmpty } from "class-validator"

export class CreateUserDto{

  @IsNotEmpty()
  readonly nome:string
  @IsNotEmpty()
  readonly Cpf:string

  @IsNotEmpty()
  readonly login: string
  @IsNotEmpty()
  readonly senha: string

  readonly province: string
  readonly state: string

  readonly idFavoritos: []
  
  @IsDefined()
  readonly isAdmin:boolean
  
  
}