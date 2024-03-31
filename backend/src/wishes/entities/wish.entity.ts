import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { DefaultEntity } from 'src/entities/defalut.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  copied: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
