import { Document, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Определяем тип документа
export type PrivateKeyDocument = PrivateKey & Document;

// Интерфейс модели с дополнительными статическими методами
export interface PrivateKeyModel extends Model<PrivateKeyDocument> {
  deleteByUser(user: string): Promise<void>;
}

@Schema({ timestamps: true }) // Включаем автоматическое добавление createdAt и updatedAt полей
export class PrivateKey {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  // Добавляем статический метод (типизация здесь важна)
  static async deleteByUser(this: PrivateKeyModel, user: string): Promise<void> {
    await this.deleteMany({ user });
  }
}

export const PrivateKeySchema = SchemaFactory.createForClass(PrivateKey);

// Создаем TTL индекс для поля createdAt
PrivateKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Добавляем статический метод к модели
PrivateKeySchema.statics.deleteByUser = async function (user: string): Promise<void> {
  await this.deleteMany({ user });
};
