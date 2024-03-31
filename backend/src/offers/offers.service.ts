import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { itemId, amount, ...data } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId);

    if (wish.owner.id === user.id) {
      throw new ConflictException(
        'Нельзя отправлять деньги самому себе на желение',
      );
    }
    if (wish.raised + amount > wish.price) {
      throw new BadRequestException(
        'Сумма пожертвование не может превышать стоимость подарка',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Wish, itemId, {
        raised: wish.raised + createOfferDto.amount,
      });
      const update = await queryRunner.manager.findOneBy(Wish, {
        id: itemId,
      });
      const offer = await queryRunner.manager.save(Offer, {
        ...data,
        user,
        item: update,
      });
      await queryRunner.commitTransaction();
      return offer;
    } catch (error) {
      throw new InternalServerErrorException(
        `Ошибка при проведения операции ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offerRepository.findOneBy({ id });
  }
}
