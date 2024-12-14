import { Document } from 'mongoose';
export interface ICustomer extends Document {
  readonly _id: string;
  readonly id: number;
  readonly date_created: [];
  readonly date_modified: [];
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly role: string;
  readonly username: string;
  readonly password: string;
  readonly display_name: string;
  readonly billing: [];
  readonly shipping: [];
  readonly is_paying_customer: string;
  readonly avatar_url: string;
  readonly meta_data: [];
  readonly _links: [];
}
