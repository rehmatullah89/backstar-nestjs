import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ProductCategories,
  ProductImages,
  ProductDimensions,
  MetaDataItem,
  CompositeComponentsDto,
  ProductTags,
} from '../dto/create-product.dto';
@Schema()
export class Products extends Document {
  @Prop({ type: Number, required: false })
  id: number;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  slug: string;
  @Prop({ type: String, required: false })
  styled_title: String;
  @Prop({ type: String, required: false })
  image_url: String;

  @Prop({ type: String, required: false })
  permalink: string;
  @Prop({ type: Date, required: false })
  date_created: string;
  @Prop({ type: Date, required: false })
  date_created_gmt: string;
  @Prop({ type: Date, required: false })
  date_modified: Date;
  @Prop({ type: Date, required: false })
  date_modified_gmt: Date;
  @Prop({ type: String, required: false })
  type: string;
  @Prop({ type: String, required: false })
  status: string;
  @Prop({ type: Boolean, default: false })
  featured: boolean;
  @Prop({ type: String, default: false })
  catalog_visibility: String;
  @Prop({ type: String, default: false })
  description: String;
  @Prop({ type: String, default: false })
  short_description: String;
  @Prop({ type: String, default: false })
  sku: string;
  @Prop({ type: String, required: false })
  price: string;
  @Prop({ type: String, required: false })
  regular_price: string;
  @Prop({ type: String, required: false })
  sale_price: string;
  @Prop({ type: String, required: false })
  date_on_sale_from: String;
  @Prop({ type: String, required: false })
  date_on_sale_from_gmt: string;
  @Prop({ type: String, required: false })
  date_on_sale_to: string;
  @Prop({ type: String, required: false })
  date_on_sale_to_gmt: string;
  @Prop({ type: Boolean, required: false })
  on_sale: Boolean;
  @Prop({ type: Boolean, required: false })
  purchasable: Boolean;
  @Prop({ type: String, required: false })
  total_sales: string;
  @Prop({ type: Boolean, default: false })
  virtual: boolean;
  @Prop({ type: Boolean, default: false })
  downloadable: boolean;
  @Prop({ type: [], default: false })
  downloads: any[];
  @Prop({ type: String, default: false })
  download_limit: string;
  @Prop({ type: String, default: false })
  download_expiry: string;
  @Prop({ type: String, default: false })
  external_url: string;
  @Prop({ type: String, default: false })
  button_text: string;
  @Prop({ type: String, default: false })
  tax_status: string;
  @Prop({ type: String, default: false })
  tax_class: string;
  @Prop({ type: Boolean, default: false })
  manage_stock: Boolean;
  @Prop({ type: Number, default: false })
  stock_quantity: Number;
  @Prop({ type: String, default: false })
  backorders: string;
  @Prop({ type: Boolean, default: false })
  backorders_allowed: Boolean;
  @Prop({ type: Boolean, default: false })
  backordered: Boolean;
  @Prop({ type: String, default: false })
  low_stock_amount: string;
  @Prop({ type: String, default: false })
  sold_individually: string;
  @Prop({ type: String, default: false })
  weight: string;
  @Prop({ type: [Object], default: [] })
  dimensions: ProductDimensions[];
  @Prop({ type: [Object], default: [] })
  images: ProductImages[];
  @Prop({ type: [Object], default: [] })
  categories: ProductCategories[];
  @Prop({ type: Boolean, default: false })
  shipping_required: Boolean;
  @Prop({ type: Boolean, default: false })
  shipping_taxable: Boolean;
  @Prop({ type: String, default: false })
  shipping_class: string;
  @Prop({ type: Number, default: false })
  shipping_class_id: Number;
  @Prop({ type: Boolean, default: false })
  reviews_allowed: Boolean;
  @Prop({ type: String, default: false })
  average_rating: string;
  @Prop({ type: Number, default: 0 })
  rating_count: Number;
  @Prop({ type: [String], default: [] })
  upsell_ids: string[];
  @Prop({ type: [String], default: [] })
  cross_sell_ids: string[];
  @Prop({ type: String, default: 0 })
  parent_id: string;
  @Prop({ type: String, default: false })
  purchase_note: string;
  @Prop({ type: [Object], default: [] })
  tags: ProductTags;
  @Prop({ type: [String], default: false })
  attributes: string[];
  @Prop({ type: [String], default: false })
  default_attributes: string[];
  @Prop({ type: [String], default: false })
  variations: string[];
  @Prop({ type: [String], default: false })
  grouped_products: string[];
  @Prop({ type: Number, default: false })
  menu_order: Number;
  @Prop({ type: String, default: false })
  price_html: String;
  @Prop({ type: [String], default: false })
  related_ids: string[];
  @Prop({ type: Object, default: {} }) // Change the type to Object and set default to an empty object
  meta_data: Record<string, string | string[] | number>; //
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ type: String, default: false })
  stock_status: string;
  @Prop({ type: Boolean, default: false })
  has_options: Boolean;
  @Prop({ type: String, default: false })
  post_password: string;
  @Prop({ type: Boolean, default: false })
  composite_virtual: Boolean;
  @Prop({ type: String, default: false })
  composite_layout: string;
  @Prop({ type: false, default: false })
  composite_editable_in_cart: false;
  @Prop({ type: String, default: false })
  composite_sold_individually_context: false;
  @Prop({ type: String, default: false })
  composite_shop_price_calc: string;
  @Prop({ type: [Object], default: [] })
  composite_components: CompositeComponentsDto[];
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
