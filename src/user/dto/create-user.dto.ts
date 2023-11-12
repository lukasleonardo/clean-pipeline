import { IsNotEmpty } from 'class-validator';


export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;
  //@IsNotEmpty()
  readonly cpf: string;
  //@IsNotEmpty()
  readonly username: string;
  //@IsNotEmpty()
  readonly password: string;
  //@IsNotEmpty()
  readonly province: string;

}
