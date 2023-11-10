import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';
//import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RentalsModule } from './rentals/rentals.module';
//import { RolesGuard } from './shared/authorize/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GenreModule,
    BookModule,
    DatabaseModule,
    RentalsModule,

  ],
  controllers: [AppController],
providers: [AppService,/*RolesGuard*/],
})
export class AppModule {}
