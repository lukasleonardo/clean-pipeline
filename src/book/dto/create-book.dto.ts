import { IsPositive, IsString } from "class-validator";
import { GenreEntity } from "../../genre/entities/genre.entity";
import { ApiProperty } from "@nestjs/swagger";
export class CreateBookDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  author: string;
  @ApiProperty()
  @IsPositive()
  value: number;
  @ApiProperty()
  genres:GenreEntity[]
}
