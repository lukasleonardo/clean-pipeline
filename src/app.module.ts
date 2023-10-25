import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [ GenreModule, AdminModule, BookModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
