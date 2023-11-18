import { ApiProperty } from "@nestjs/swagger";

export class UpdateBookDto { 
  @ApiProperty()
  name?: string; 
  @ApiProperty()
  description?: string;  
  @ApiProperty()
  author?: string; 
  @ApiProperty()
  value?: number; 

}
