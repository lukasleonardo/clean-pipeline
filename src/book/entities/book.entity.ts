import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';

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
  @ManyToMany(() => GenreEntity)
  @JoinTable({
    name: 'genres_book',
    joinColumns: [{ name: 'book_id' }], // origin table;
    inverseJoinColumns: [{ name: 'genre_id' }], // relation table;
  })
  genre: GenreEntity[];
  // referente ao usuario que esta em posse do livro
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  // administrador que cadastrou o livro
  @OneToOne(() => UserEntity)
  @JoinColumn()
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}


