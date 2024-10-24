import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Subscription } from "rxjs";
import { Model } from "mongoose";
import { SubscriptionDocument } from "./models/subscription.model";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { Cups, CupsDocument } from "./models/cups.model";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JWTDecode } from "../shared/interfaces/JWTDecode";
import { InteractionClientCupsDto } from "./dto/interaction-client-cups.dto";
import { PrivateKeyService } from "../private-key/private-key.service";
import { InteractionCompanyCupsDto } from "./dto/interaction-company-cups.dto";

@Injectable()
export class SubscriptionService {

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Cups.name) private cupsModel: Model<CupsDocument>,
    private jwt: JwtService,
    private user: UserService,
    private privateKeys: PrivateKeyService
  ) {}


  async currentSubscription(token: string, res: Response) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this.user.getByEmail(parsedToken.email)
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})

    const userId = user._id as string;

    const subscription = await this.subscriptionModel.findOne({user: userId})

    return res.status(200).json(subscription)

  }

  async getCompanyStatistic(token: string, res: Response) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const barista = await this.user.getByEmail(parsedToken.email)
    if (!barista)
      return res.status(404).json({message: 'Пользователь не найден'})

    const baristaId = barista._id as string;
    const cups = await this.cupsModel.find({user: baristaId})
    return res.status(200).json(cups)
  }

  async cupsPrivateTurnover(token: string, res: Response, dto: InteractionClientCupsDto) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const barista = await this.user.getByEmail(parsedToken.email)
    if (!barista)
      return res.status(404).json({message: 'Пользователь не найден'})

    const baristaId = barista._id as string;
    switch (dto.type) {
      case "order": return this.incrementCups(baristaId, dto.key, res)
      case "return": return this.decrementCups(baristaId, dto.key, res)
    }
  }

  async cupsCompanyTurnover(token: string, res: Response, dto: InteractionCompanyCupsDto) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const barista = await this.user.getByEmail(parsedToken.email)
    if (!barista)
      return res.status(404).json({message: 'Пользователь не найден'})

    const baristaId = barista._id as string;
    switch (dto.type) {
      case "order": return this.orderCups(baristaId, dto.amount, res)
      case "return": return this.returnCups(baristaId, dto.amount, res)
    }
  }

  async create(createSubscriptionDto: CreateSubscriptionDto, res: Response, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this.user.getByEmail(parsedToken.email)
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})

    const userId = user._id as string;

    const currentSubscription = await this.subscriptionModel.findOne({user: userId})

    if (currentSubscription) {
      const cupsCurrent = currentSubscription.cupsCurrent;
      if (cupsCurrent > this.getAvailableCupsForTypes(createSubscriptionDto.type)) {
        return res.status(400).json({ message: 'У вас больше взятых кружек, чем доступно в новой подписке'})
      }
      const newSubscription = await this.subscriptionModel.findOneAndUpdate({user: userId}, {
        period: createSubscriptionDto.period,
        type: createSubscriptionDto.type,
        cupsAvailable: this.getAvailableCupsForTypes(createSubscriptionDto.type),
      }, {new: true})
      return res.status(201).json(newSubscription)
    }

    const newSubscription = await this.subscriptionModel.create({
      period: createSubscriptionDto.period,
      type: createSubscriptionDto.type,
      user: userId,
      cupsAvailable: this.getAvailableCupsForTypes(createSubscriptionDto.type),
      cupsCurrent: 0
    })

    return res.status(201).json(newSubscription)

  }


  getAvailableCupsForTypes(type: 'privateBase' | 'privateStudent'| 'companyBase' | 'companyPremium') {
    switch (type) {
      case "companyBase": return 600 * 31;
      case "companyPremium": return 1000 * 31;
      case "privateStudent": return 3;
      case "privateBase": return 5;
    }
  }


  async orderCups(baristaId: string, amount: number, res: Response) {
    const subscriptionBarista = await this.subscriptionModel.findOne({ user: baristaId })
    if (!subscriptionBarista) {
      return res.status(404).json({message: 'Подписка не найдена'})
    }

    if (subscriptionBarista.cupsCurrent + amount > subscriptionBarista.cupsAvailable)
      return res.status(404).json({message: 'Вы не можете заказать больше кружек, чем по подписке'})

    subscriptionBarista.cupsCurrent += amount;
    await subscriptionBarista.save();

    const order = await this.cupsModel.create({
      user: baristaId,
      amount: amount,
      type: 'order',
    })

    return res.status(200).json(order);
  }

  async returnCups(baristaId: string, amount: number, res: Response) {
    const subscriptionBarista = await this.subscriptionModel.findOne({ user: baristaId })
    if (!subscriptionBarista) {
      return res.status(404).json({message: 'Подписка не найдена'})
    }

    if (subscriptionBarista.cupsCurrent - amount < 0)
      return res.status(404).json({message: 'Вы не можете сдать больше кружек, чем у вас есть'})

    subscriptionBarista.cupsCurrent -= amount;
    await subscriptionBarista.save();

    const order = await this.cupsModel.create({
      user: baristaId,
      amount: amount,
      type: 'return',
    })

    return res.status(200).json(order);
  }

  async decrementCups(baristaId: string, privateKey: string, res: Response) {
    const key = await this.privateKeys.getPrivateKey(privateKey)

    if (!key)
      return res.status(404).json({message: 'Ключ не найден, попросите пользователя сгенерировать новый'})

    const userId = key.user

    await this.privateKeys.removePrivateKey(privateKey)

    const subscriptionBarista = await this.subscriptionModel.findOne({ user: baristaId })
    const subscriptionUser = await this.subscriptionModel.findOne({ user: userId });

    if (!subscriptionUser || !subscriptionBarista) {
      return res.status(404).json({message: 'Подписка не найдена'})
    }
    if (subscriptionUser.cupsCurrent <= 0) {
      return res.status(400).json({message: 'У пользователя нет взятых кружек'})
    }
    subscriptionBarista.cupsCurrent += 1;
    subscriptionUser.cupsCurrent -= 1;
    await subscriptionBarista.save();
    await subscriptionUser.save();
    return res.status(200).json(null)
  }

  async incrementCups(baristaId: string, privateKey: string, res: Response) {
    const key = await this.privateKeys.getPrivateKey(privateKey)

    if (!key)
      return res.status(404).json({message: 'Ключ не найден, попросите пользователя сгенерировать новый'})

    const userId = key.user;

    await this.privateKeys.removePrivateKey(privateKey)

    const subscriptionUser = await this.subscriptionModel.findOne({ user: userId });
    const subscriptionBarista = await this.subscriptionModel.findOne({ user: baristaId })

    if (!subscriptionUser || !subscriptionBarista) {
      return res.status(404).json({message: 'Подписка не найдена'})
    }
    if (subscriptionUser.cupsCurrent >= subscriptionUser.cupsAvailable) {
      return res.status(400).json({message: 'У пользователя максимальное количество кружек по подписке'})
    }
    if (subscriptionBarista.cupsCurrent <= 0) {
      return res.status(400).json({message: 'У вас не осталось свободных кружек'})
    }

    subscriptionUser.cupsCurrent += 1;
    await subscriptionUser.save();
    return res.status(200).json(null)
  }


  async getAllStatistic(res: Response, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this.user.getByEmail(parsedToken.email)
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})
    if (!user.isAdmin)
      return res.status(403).json({message: 'Пользователь не админ'})

    const cups = await this.cupsModel.find().populate('user').exec()

    return res.status(200).json(cups)
  }


}
