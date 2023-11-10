import { IsNotEmpty, isNotEmpty } from 'class-validator';


export class UpdateUserDto {
    readonly name: string;
    //@IsNotEmpty()
    readonly cpf: string;
    //@IsNotEmpty()
    readonly login: string;
    //@IsNotEmpty()
    readonly password: string;
    //@IsNotEmpty()
    readonly province: string;

}
