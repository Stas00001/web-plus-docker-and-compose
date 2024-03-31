import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utils/hash';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });
    try {
      return await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Пользователь уже существует');
      }
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findByUserName(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findMany({ query }): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const hash = await hashPassword(updateUserDto.password);
      updateUserDto = { ...updateUserDto, password: hash };
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes;
  }
  async remove(id: number) {
    return await this.usersRepository.delete({ id });
  }
}
