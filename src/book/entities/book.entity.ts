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
  OneToMany,
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

  @ManyToMany(type => GenreEntity,{cascade:true})
  @JoinTable({
    name: 'book_genres',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'genres_id',
      referencedColumnName: 'id',
    }
  })
  genreList: GenreEntity[];

  // // administrador que cadastrou o livro
  @OneToOne(() => UserEntity)
  @JoinColumn({name:'admin_id'})
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: 'now()'})
  createdAt: Timestamp;

}
