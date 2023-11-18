import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty()
    readonly name?: string;
    @ApiProperty()
    readonly cpf?: string;
    @ApiProperty()
    readonly username?: string;
    @ApiProperty()
    readonly password?: string;
    @ApiProperty()
    readonly province?: string;
}
