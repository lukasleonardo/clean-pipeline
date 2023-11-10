import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 50 })
  name: string;
  @Column({ length: 50 })
  login: string;
  @Column({ length: 100 })
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

}
