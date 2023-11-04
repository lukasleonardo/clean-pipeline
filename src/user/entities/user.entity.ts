import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: string;
  @Column({ length: 50 })
  name: string;
  @Column({ length: 50 })
  login: string;
  @Column({ length: 50 })
  password: string;
  @Column({ length: 50 })
  province: string;
  @Column({ length: 20 })
  cpf: string;
  @Column('double precision')
  fines: number;

  @Column({ default: 'USER' })
  isAdmin: string;
  @Column({ default: 'DISPONIVEL' })
  state: string;

  @Column({ type: 'jsonb', array: true, nullable: true })
  idFavorites: string[];
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
