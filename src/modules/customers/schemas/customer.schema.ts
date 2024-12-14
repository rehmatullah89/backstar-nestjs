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
export class DateFormat {
  @Prop()
  date: string;
  @Prop()
  timezone_type: number;
  @Prop()
  timezone: string;
}

@Schema()
export class Customer extends Document {
  @Prop()
  id: number;
  @Prop({ type: [DateFormat], default: [] })
  date_created: DateFormat[];
  @Prop({ type: [DateFormat], default: [] })
  date_modified: DateFormat[];
  @Prop()
  email: string;
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  role: string;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  display_name: string;
  @Prop({ type: [Billing], default: [] })
  billing: Billing[];
  @Prop({ type: [Shipping], default: [] })
  shipping: Shipping[];
  @Prop()
  is_paying_customer: string;
  @Prop()
  avatar_url: string;
  /*@Prop({ type: [MetaDataItem], default: [] })
  meta_data: MetaDataItem[];*/
  @Prop({ type: Object, default: {} }) // Change the type to Object and set default to an empty object
  meta_data: Record<string, string | string[] | number>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
