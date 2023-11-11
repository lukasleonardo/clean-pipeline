import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  province: string;
  @Column()
  cpf: string;
  @Column('double precision', { default: 0})
  fines: number;

  @Column({ default: 'USER' })
  isAdmin: string;
  @Column({ default: 'DISPONIVEL' })
  state: string;

  @Column({ type: 'jsonb', array: true, nullable: true })
  idFavorites: string[];

}
