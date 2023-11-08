import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RentalsModule } from './rentals/rentals.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GenreModule,
    BookModule,
    DatabaseModule,
    RentalsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
