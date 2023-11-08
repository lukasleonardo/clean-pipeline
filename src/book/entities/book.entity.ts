import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
  Timestamp,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';


@Entity('book')
export class BookEntity implements IBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ length: 3000 })
  description: string;
  @Column({ length: 50 })
  author: string;
  @Column('double precision')
  value: number;

  @Column({ type:'varchar', default: 'DISPONIVEL' })
  state: string;

  @ManyToMany(() => GenreEntity)
  @JoinTable({
    name: 'genres_book',
    joinColumns: [{ name: 'book_id', referencedColumnName:'id' }], // origin table;
    inverseJoinColumns: [{ name: 'genre_id' }], // relation table;
  })
  genre: GenreEntity[];

  // // administrador que cadastrou o livro
  @OneToOne(() => UserEntity)
  @JoinColumn({name:'admin_id'})
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: 'now()'})
  createdAt: Timestamp;

  // constructor() {
  //   if (!this.id) {
  //     this.id = uuidV4();
  //   }
  // }

}
