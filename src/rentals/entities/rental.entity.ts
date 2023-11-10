import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";


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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;


}
