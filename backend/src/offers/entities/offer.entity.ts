import { Entity, Column, ManyToOne } from 'typeorm';
import { IsBoolean, IsNumber } from 'class-validator';
import { DefaultEntity } from 'src/entities/defalut.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends DefaultEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
