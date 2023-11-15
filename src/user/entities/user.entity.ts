import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookEntity } from '../../book/entities/book.entity';
import { IUser } from '../interfaces/user.interface';

@Entity('user')
export class UserEntity implements IUser{
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

  @Column({ default: 'USER' })
  role: string;
  @Column({ default: 'DISPONIVEL' })
  state: string;

  @ManyToMany(type => BookEntity, {eager:true})
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
  favoriteBooks: BookEntity[];
}
