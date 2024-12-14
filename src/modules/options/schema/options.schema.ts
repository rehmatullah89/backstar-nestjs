import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
@Schema()
export class Option extends Document {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) 
  value: any;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
