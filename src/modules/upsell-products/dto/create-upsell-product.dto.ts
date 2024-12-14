import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateUpsellProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  // @IsNotEmpty()
  // @IsArray()
  // @Type(() => Object) // Change this line to specify that it's an array of objects
  // products: { id: string }[];

  @IsNotEmpty()
  @IsArray()
  // @Type(() => Types.ObjectId)
  products: string[];

  @IsNotEmpty()
  @IsString()
  title_show: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  offer_text: string;

  @IsString()
  @Type(() => String)
  product_feature_image_url: string;
}

// export class CreateUpsellProductsDto{
//     @IsArray()
//     @ValidateNested({each:true})
//     @Type(()=>CreateUpsellProductDto)
//     data : CreateUpsellProductDto[]
// }
