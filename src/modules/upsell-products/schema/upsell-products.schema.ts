import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Products } from 'src/modules/products/schemas/products.schemas';

@Schema()
export class UpsellProduct extends Document {
  @Prop({ required: true, type: Number })
  id: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Products',
    name: 'product',
  })
  product: Products;

  @Prop({
    type: [
      {
        _id: false,
        id: String,
        product: { type: MongooseSchema.Types.ObjectId, ref: 'Products' },
      },
    ],
    name: 'products',
  })
  products: { id: string; product: Types.ObjectId }[];

  // @Prop({ required: true, type: [String] })
  // products: string[];

  @Prop({ required: true })
  title_show: string;

  @Prop({ required: true })
  offer_text: string;
  @Prop()
  product_feature_image_url: string;
}

export const UpsellProductSchema = SchemaFactory.createForClass(UpsellProduct);
