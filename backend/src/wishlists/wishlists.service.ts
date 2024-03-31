import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  UseGuards,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwtAuth.guards';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const { itemsId, ...createWishData } = createWishlistDto;
    const items = itemsId.map((id) => {
      return { id } as unknown as Wish;
    });
    const wishList = this.wishlistsRepository.create({
      ...createWishData,
      items: items,
      owner: user,
    });
    return await this.wishlistsRepository.save(wishList);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find();
  }

  async findOneId(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotAcceptableException('Cписок не найден');
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOneId(id);
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя редактировать чужой список');
    }
    return (await this.wishlistsRepository.update(id, updateWishlistDto)).raw;
  }

  async remove(id: number, user: User): Promise<User> {
    const wishlist = await this.findOneId(id);
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалять чужой список');
    }
    return (await this.wishlistsRepository.delete({ id })).raw;
  }
}
