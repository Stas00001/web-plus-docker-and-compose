import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsUrl, Length } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  name?: string;

  @IsUrl()
  link?: string;

  @IsUrl()
  image?: string;

  @IsInt()
  price?: number;

  @Length(1, 1024)
  description?: string;

  @IsInt()
  raised?: number;
}
