import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookEntity } from '../../book/entities/book.entity';

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

  // Coragem para mudar!
  @ManyToMany(type => BookEntity,{ eager: true})
  @JoinTable({
    name: 'bookmarks', 
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',     
    },
    inverseJoinColumn: {
      name: 'book_id',
      referencedColumnName: 'id', 
    }
  })
  idFavorites: BookEntity[];

}
