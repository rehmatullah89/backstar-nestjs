import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Billing {
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  company: string;
  @Prop()
  address_1: string;
  @Prop()
  address_2: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  postcode: string;
  @Prop()
  country: string;
  @Prop()
  email: string;
  @Prop()
  phone: string;
}

@Schema()
export class Shipping {
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  company: string;
  @Prop()
  address_1: string;
  @Prop()
  address_2: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  postcode: string;
  @Prop()
  country: string;
  @Prop()
  phone: string;
}

@Schema()
export class MetaDataItem {
  @Prop()
  id: number;
  @Prop()
  key: string;
  @Prop({ type: Object })
  value: any;
}

@Schema()
export class MetaDataLineItem {
  @Prop()
  id: number;
  @Prop()
  key: string;
  @Prop({ type: Object })
  value: any;
  @Prop()
  display_key: string;
  @Prop()
  display_value: string;
}

@Schema()
export class LineItemImage {
  @Prop()
  id: string;
  @Prop()
  src: string;
}

@Schema()
export class LineItem {
  @Prop()
  id: number;
  @Prop()
  name: string;
  @Prop()
  product_id: number;
  @Prop()
  variation_id: number;
  @Prop()
  quantity: number;
  @Prop()
  tax_class: string;
  @Prop()
  subtotal: string;
  @Prop()
  subtotal_tax: string;
  @Prop()
  total: string;
  @Prop()
  total_tax: string;
  @Prop()
  taxes: [];
  @Prop({ type: [MetaDataLineItem], default: [] })
  meta_data: MetaDataLineItem[];
  @Prop()
  sku: string;
  @Prop()
  price: number;
  @Prop({ type: [LineItemImage], default: [] })
  image: LineItemImage[];
  @Prop()
  parent_name: string;
  @Prop()
  cog_item_cost: number;
  @Prop()
  cog_item_total_cost: number;
  @Prop()
  composite_parent: number;
  @Prop()
  composite_children: [];
  @Prop()
  status_title: string;
  @Prop()
  progress: number;
  @Prop()
  tray_number: string;
  @Prop()
  tray_price2mm: number;
  @Prop()
  tray_price3mm: number;
  @Prop()
  subscription_details: [];
}

@Schema()
export class ShippingLine {
  @Prop()
  id: number;
  @Prop()
  method_title: string;
  @Prop()
  method_id: string;
  @Prop()
  instance_id: string;
  @Prop()
  total: string;
  @Prop()
  total_tax: string;
  @Prop()
  taxes: [];
  @Prop({ type: [MetaDataLineItem], default: [] })
  meta_data: MetaDataLineItem[];
}

@Schema()
export class DateFormat {
  @Prop()
  date: string;
  @Prop()
  timezone_type: number;
  @Prop()
  timezone: string;
}

@Schema()
export class Order extends Document {
  @Prop()
  id: number;
  @Prop()
  parent_id: number;
  @Prop()
  status: string;
  @Prop()
  currency: string;
  @Prop()
  version: string;
  @Prop()
  prices_include_tax: boolean;
  @Prop({ type: [DateFormat], default: [] })
  date_created: DateFormat[];
  @Prop({ type: [DateFormat], default: [] })
  date_modified: DateFormat[];
  @Prop()
  discount_total: string;
  @Prop()
  discount_tax: string;
  @Prop()
  shipping_total: string;
  @Prop()
  shipping_tax: string;
  @Prop()
  cart_tax: string;
  @Prop()
  total: string;
  @Prop()
  total_tax: string;
  @Prop()
  customer_id: number;
  @Prop()
  order_key: string;
  @Prop({ type: [Billing], default: [] })
  billing: Billing[];
  @Prop({ type: [Shipping], default: [] })
  shipping: Shipping[];
  @Prop()
  payment_method: string;
  @Prop()
  payment_method_title: string;
  @Prop()
  transaction_id: string;
  @Prop()
  customer_ip_address: string;
  @Prop()
  customer_user_agent: string;
  @Prop()
  created_via: string;
  @Prop()
  customer_note: string;
  @Prop({ type: [DateFormat], default: [] })
  date_completed: DateFormat[];
  @Prop({ type: [DateFormat], default: [] })
  date_paid: DateFormat[];
  @Prop()
  cart_hash: string;
  @Prop()
  order_stock_reduced: string;
  @Prop()
  download_permissions_granted: string;
  @Prop()
  new_order_email_sent: string;
  @Prop()
  recorded_sales: string;
  @Prop()
  recorded_coupon_usage_counts: string;
  @Prop()
  number: string;
  @Prop()
  shipping_method: string;
/*@Prop({ type: [MetaDataItem], default: [] })
  meta_data: MetaDataItem[];*/
  @Prop({ type: Object, default: {} }) // Change the type to Object and set default to an empty object
  meta_data: Record<string, string | string[] | number>;
  @Prop({ type: [LineItem], default: [] })
  line_items: LineItem[];
  @Prop()
  tax_lines: [];
  @Prop({ type: [ShippingLine], default: [] })
  shipping_lines: ShippingLine[];
  @Prop()
  fee_lines: [];
  @Prop()
  coupon_lines: [];
  @Prop()
  order_notes: [];
  @Prop()
  easy_post_data: [];
  @Prop()
  subscription_orders: [];
  @Prop()
  refunds: [];
  @Prop()
  payment_url: string;
  @Prop()
  is_editable: boolean;
  @Prop()
  needs_payment: boolean;
  @Prop()
  needs_processing: boolean;
  @Prop()
  date_created_gmt: string;
  @Prop()
  date_modified_gmt: string;
  @Prop()
  date_completed_gmt: string;
  @Prop()
  date_paid_gmt: string;
  @Prop()
  currency_symbol: string;
  @Prop()
  _links: [];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
