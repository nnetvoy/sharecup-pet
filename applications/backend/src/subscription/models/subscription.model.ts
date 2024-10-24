import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({ required: true, enum: ['privateBase', 'privateStudent', 'companyBase', 'companyPremium'] })
  type: string;

  @Prop({ required: true, enum: ['month', 'year'] })
  period: string;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  cupsAvailable: number;

  @Prop({ required: true, default: 0 })
  cupsCurrent: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
