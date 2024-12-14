import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Schema as MongooseSchema } from 'mongoose';



@Schema()
export class LineTaxData {
  @Prop({ type: Map, of: Number }) // Map to store dynamic keys and values
  subtotal: Map<string, number>;

  @Prop({ type: Map, of: Number }) // Map to store dynamic keys and values
  total: Map<string, number>;
}

export const LineTaxDataSchema = SchemaFactory.createForClass(LineTaxData);
@Schema({_id:false})
export class CartTotals {
  @Prop({ required: true })
  subtotal: string;

  @Prop({ required: true })
  subtotal_tax: number;

  @Prop({ required: true })
  shipping_total: string;

  @Prop({ required: true })
  shipping_tax: number;

  @Prop({ required: false })
  shipping_taxes: any[];

  @Prop({ required: true })
  discount_total: number;

  @Prop({ required: true })
  discount_tax: number;

  @Prop({ required: true })
  cart_contents_total: string;

  @Prop({ required: true })
  cart_contents_tax: number;

  @Prop({ required: false, type: Map })
  cart_contents_taxes:  Map<string, number>;;

  @Prop({ required: true })
  fee_total: string;

  @Prop({ required: true })
  fee_tax: number;

  @Prop({ required: false })
  fee_taxes: any[];

  @Prop({ required: true })
  total: string;

  @Prop({ required: true })
  total_tax: number;

  @Prop({ required: false })
  coupons: any[];
}

export const CartTotalsSchema = SchemaFactory.createForClass(CartTotals);



@Schema( {_id: false})
export class CartItem {


  @Prop({ required: true })
  id: number;

  
  @Prop({ required: false })
  key: string;

  
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  image_url: string;

  @Prop({ required: false })
  product_feature_image_url: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: false })
  sale_price: string;

  @Prop({ required: false })
  regular_price: string;

  @Prop({ required: false })
  on_sale: boolean;



  @Prop({ required: false })
  product_id: number;

  @Prop({ required: false })
  variation_id: number;

  @Prop({ required: false, type: [String] })
  variation: string[];

  @Prop({ required: false })
  quantity: number;

  @Prop({ required: false })
  data_hash: string;

  @Prop({ required: false, type: LineTaxDataSchema })
  line_tax_data: LineTaxData;

  @Prop({ required: false })
  line_subtotal: number;

  @Prop({ required: false })
  line_subtotal_tax: number;

  @Prop({ required: false })
  line_total: number;

  @Prop({ required: false })
  line_tax: number;

  @Prop({ required: false , type: {} })
  data: any;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart {
  @Prop({ required: false })
  device_id: string;

  @Prop({ required: false, type: CartTotalsSchema })
  cart_totals: CartTotals;

  @Prop({ required: false, type: Map, of: CartItemSchema }) // Define cart_items as a map
  cart_items: Map<string, CartItem>; // Key is string, value is CartItem
}

export const CartSchema = SchemaFactory.createForClass(Cart);
