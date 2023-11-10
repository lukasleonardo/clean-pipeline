import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalEntity } from './entities/rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RentalEntity])],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
