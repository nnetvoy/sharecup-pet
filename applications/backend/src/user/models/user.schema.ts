import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, default: false })
  company: boolean;

  @Prop({default: null})
  companyInn: string;

  @Prop({default: null})
  companyOgrn: string;

  @Prop({default: null})
  companyKpp: string;

  @Prop({default: null})
  companyAddress: string;

  @Prop({default: null})
  companyName: string;

  @Prop({ type: Date, default: () => new Date(), required: false })
  createdAt?: Date;

  @Prop({type: Boolean, default: false})
  isAdmin: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
