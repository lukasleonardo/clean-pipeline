import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { roles } from '../../shared/global.enum';

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;
  //@IsNotEmpty()
  readonly cpf: string;
  //@IsNotEmpty()
  readonly login: string;
  //@IsNotEmpty()
  readonly password: string;
  //@IsNotEmpty()
  readonly fines: number
  readonly province: string;
  readonly isAdmin: roles;
  readonly state: string;
  readonly idFavorites: string[];
}
