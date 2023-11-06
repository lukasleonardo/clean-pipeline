import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { v4 as uuidV4 } from 'uuid';

@Entity('rentals')
export class Rental {

  @PrimaryColumn()
  id:string

  @Column()
  loanDate: Date;
  @Column()
  expiratedLoanDate: Date;

  // referente ao usuario que esta em posse do livro
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  //inicializa id
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
