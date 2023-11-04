import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('Book')
export class BookEntity implements IBook {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  name: string;
  @Column({ length: 3000 })
  description: string;
  @Column({ length: 50 })
  author: string;
  @Column('double precision')
  value: number;

  @Column({ default: 'DISPONIVEL' })
  state: string;
  // datas de empréstimo e devolução
  @Column()
  loanDate: Date;
  @Column()
  expiratedLoanDate: Date;

  // MANY TO MANY ???
  @ManyToMany((GenreEntity) => GenreEntity)
  @JoinTable()
  idGenre: GenreEntity[];
  // referente ao usuario que esta em posse do livro
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  // administrador que cadastrou o livro
  @OneToOne(() => UserEntity)
  @JoinColumn()
  createdBy: UserEntity;

  @Column()
  createdAt: Date;
}
