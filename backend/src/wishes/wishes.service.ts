import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return await this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find();
  }

  async findMany(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find(query);
  }
  async getLastWish(amount: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: amount,
    });
  }
  async getTopWish(amount: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: amount,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
        owner: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужие хотелки');
    }
    if (wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Нельзя редактировать хотелки, на которые уже скидываются',
      );
    }
    return (await this.wishesRepository.update(id, updateWishDto)).raw;
  }

  async wishCopy(id: number, user: User): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    const wish = await this.wishesRepository.findOneBy({ id });
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.update(Wish, id, {
        ...wish,
        copied: wish.copied + 1,
      });
      const copiedWish = queryRunner.manager.create(Wish, {
        ...wish,
        owner: user,
      });
      await queryRunner.manager.save(copiedWish);
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, userId: number): Promise<User> {
    const wish = await this.wishesRepository.findOneBy({ id });
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие хотелки');
    }
    return (await this.wishesRepository.delete({ id })).raw;
  }
}
