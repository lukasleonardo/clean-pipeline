import { IsNotEmpty } from 'class-validator';
export class CreateGenreDto {
  @IsNotEmpty()
  readonly name: string;
}
