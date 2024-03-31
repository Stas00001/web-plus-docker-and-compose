import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsString, IsUrl, Length } from 'class-validator';
import { DefaultEntity } from 'src/entities/defalut.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
