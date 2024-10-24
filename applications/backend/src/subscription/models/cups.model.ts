import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CupsDocument = Cups & Document;

@Schema()
export class Cups {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  amount: number;

  @Prop({enum: ['order', 'return']})
  type: string;

  @Prop({type: Boolean, default: false})
  approve: boolean;

  @Prop({ type: Date, default: () => new Date(), required: false })
  createdAt?: Date;

}

export const CupsSchema = SchemaFactory.createForClass(Cups)
