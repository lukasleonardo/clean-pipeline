import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { BookEntity } from "../../book/entities/book.entity";
import { IRental } from "../Interfaces/rental.interface";


@Entity('rentals')
export class RentalEntity implements IRental{

  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column()
  loanDate: Date;
  
  @Column()
  expiratedLoanDate: Date;

  @Column('double precision', { default: 0})
  fines: number;

  @ManyToOne(() => UserEntity, {eager:true})
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => BookEntity, {eager:true})
  @JoinColumn()
  book: BookEntity;

}
