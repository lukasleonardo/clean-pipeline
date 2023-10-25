import { Column, PrimaryColumn } from "typeorm";
import { IAdmin } from "../interfaces/admin.interface";
export class Admin implements IAdmin {
  
  @PrimaryColumn()
  id:number;
  @Column()
  login:string;
  @Column()
  password:string;

}
