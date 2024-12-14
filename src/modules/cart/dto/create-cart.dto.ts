import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
  isString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

class CartContentsTaxes {
  key: string;
  value: string[];
}

class CartTotals {
  @IsString()
  subtotal: string;

  @IsNumber()
  subtotal_tax: number;

  @IsString()
  shipping_total: string;

  @IsNumber()
  shipping_tax: number;

  @IsOptional()
  shipping_taxes: any[];

  @IsNumber()
  discount_total: number;

  @IsNumber()
  discount_tax: number;

  @IsString()
  cart_contents_total: string;

  @IsNumber()
  cart_contents_tax: number;

  @IsOptional()
  @Type(() => CartContentsTaxes)
  cart_contents_taxes: CartContentsTaxes;
  // cart_contents_taxes: { [key: string]: number };

  @IsString()
  fee_total: string;

  @IsNumber()
  fee_tax: number;

  @IsOptional()
  fee_taxes: any[];

  @IsString()
  total: string;

  @IsNumber()
  total_tax: number;

  @IsOptional()
  coupons: any[];
}

class LineTaxData {
  [key: string]: { [key: string]: number };
};

class CartItem {
  @IsString()
  product_feature_image_url: string;

  @IsNumber()
  id: number;
  @IsString()
  name: string;

  @IsString()
  image_url: string;

  @IsString()
  price: string;

  @IsString()
  sale_price: string;
  
  @IsString()
  regular_price: string;

  @IsBoolean()
  on_sale: boolean;

  @IsString()
  key: string;

  @IsNumber()
  product_id: number;

  @IsNumber()
  variation_id: number;

  @IsOptional()
  @IsString({ each: true })
  variation: string[];

  @IsNumber()
  quantity: number;

  @IsString()
  data_hash: string;

  @ValidateNested()
  @Type(() => LineTaxData)
  line_tax_data: LineTaxData;

  @IsNumber()
  line_subtotal: number;

  @IsNumber()
  line_subtotal_tax: number;

  @IsNumber()
  line_total: number;
  @IsOptional()
  @IsNumber()
  line_tax: number;

  @IsOptional()
  data: any;
}
class CartItems {
  [key: string]: CartItem;
}


export class CreateCartDto {
  @IsNotEmpty()
  @IsString()
  device_id: string;


  // @IsNotEmpty()
  @ValidateNested()
  @Type(() => CartTotals)
  cart_totals: CartTotals;

  // @IsNotEmpty()
  @ValidateNested()
  @Type(() => CartItems)
  cart_items: CartItems;


}
