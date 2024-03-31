import {
  IsString,
  IsUrl,
  Length,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: Array<number>;
}
