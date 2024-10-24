import { Injectable } from '@nestjs/common';
import { Response } from "express";
import { InjectModel } from "@nestjs/mongoose";
import { PrivateKey, PrivateKeyModel } from "./schemas/private-key.schema";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { JWTDecode } from "../shared/interfaces/JWTDecode";



@Injectable()
export class PrivateKeyService {

  constructor(
    @InjectModel(PrivateKey.name) private _privateKeyModel: PrivateKeyModel,
    private user: UserService,
    private jwt: JwtService
  ) {} // Используем интерфейс PrivateKeyModel

  // Генерация случайного 6-значного числа
  private generateRandomKey(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Для запросов физика
  async createNewPrivateKey(res: Response, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this.user.getByEmail(parsedToken.email)
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})


    // Удалить предыдущие документы
    await this._privateKeyModel.deleteByUser(user._id.toString());

    // Генерация уникального ключа
    let unique = false;
    let newKey: string;
    while (!unique) {
      newKey = this.generateRandomKey();
      const existingKey = await this._privateKeyModel.findOne({ key: newKey });
      if (!existingKey) {
        unique = true;
      }
    }

    // Создание нового ключа
    const newPrivateKey = new this._privateKeyModel({ user: user._id.toString(), key: newKey });
    await newPrivateKey.save();

    return res.status(201).json({ key: newKey, createdAt: newPrivateKey.createdAt, lifeTimeSeconds: '600'});
  }


  async getCurrentPrivateKey(res: Response, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this.user.getByEmail(parsedToken.email)
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})

    const keyDocument = await this._privateKeyModel.findOne({user: user._id})
    if (!keyDocument)
      return res.status(404).json({message: 'Действующий ключ не найден'})

    return res.status(200).json({ key: keyDocument.key, createdAt: keyDocument.createdAt, lifeTimeSeconds: '600'})
  }

  // Экспортируемые функции

  async removePrivateKey(key: string) {
    return this._privateKeyModel.findOneAndDelete({key: key});
  }

  async getPrivateKey(key: string) {
    return this._privateKeyModel.findOne({key: key})
  }



}
