import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Timestamp,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { IBook } from '../interfaces/book.interface';
import { GenreEntity } from '../../genre/entities/genre.entity';
import { UserEntity } from '../../user/entities/user.entity';


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

  @ManyToMany(type => GenreEntity,{cascade:true, eager: true})
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
  @ManyToOne(() => UserEntity, {eager:true})
  @JoinColumn({name:'admin_id'})
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: 'now()'})
  createdAt: Timestamp;

}
