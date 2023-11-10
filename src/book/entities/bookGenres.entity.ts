import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GenreEntity } from "../../genre/entities/genre.entity";
import { BookEntity } from "./book.entity";

@Entity('book_genres')
export class BookGenres {
  @PrimaryColumn({ name: 'book_id' })
  bookId: number;

  @PrimaryColumn({ name: 'genres_id' })
  genresId: number;

  @ManyToOne(
    () => BookEntity,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'book_id', referencedColumnName: 'id' }])
  books: BookEntity[];

  @ManyToOne(
    () => GenreEntity,
    {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
  )
  @JoinColumn([{ name: 'genre_id', referencedColumnName: 'id' }])
  genres: GenreEntity[];
}