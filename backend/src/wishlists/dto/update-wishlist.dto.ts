import { PartialType } from '@nestjs/mapped-types';
import { IsUrl, IsNumber, Length, IsArray } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  name?: string;

  @IsUrl()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId?: number[];

  @Length(0, 1500)
  description?: string;
}
