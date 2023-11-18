import { ApiProperty } from "@nestjs/swagger";

export class CreateGenreDto {
  @ApiProperty()
  readonly name: string;
}
