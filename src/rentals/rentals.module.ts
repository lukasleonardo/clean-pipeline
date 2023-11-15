import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalEntity } from './entities/rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateRequestMiddleware } from '../auth/auth.middleware';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RentalEntity, BookEntity, UserEntity])],
  controllers: [RentalsController],
  providers: [RentalsService, UserService, AuthService, JwtService],
})
export class RentalsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateRequestMiddleware)
      .forRoutes('rentals')     
  }
}
