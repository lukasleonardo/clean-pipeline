import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { BookEntity } from "../../book/entities/book.entity";


@Entity('rentals')
export class RentalEntity {

  @PrimaryGeneratedColumn('uuid')
  id:string
  @Column('double precision')
  fines:number
  @Column()
  loanDate: Date;
  @Column()
  expiratedLoanDate: Date;

  @OneToOne(() => UserEntity, {eager:true})
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BookEntity, {eager:true})
  @JoinColumn()
  book: BookEntity[];

}
