import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { WishesService } from 'src/wishes/wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, User, Wish]),
    WishesModule,
    UsersModule,
  ],
  controllers: [OffersController],
  providers: [OffersService, WishesService],
  exports: [OffersService],
})
export class OffersModule {}
