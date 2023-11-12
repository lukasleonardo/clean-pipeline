import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalEntity } from './entities/rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentalEntity, BookEntity, UserEntity])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
