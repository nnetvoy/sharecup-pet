import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JWTDecode } from "../shared/interfaces/JWTDecode";
import { Response } from "express";
import { Model } from "mongoose";
import { User, UserDocument } from "./models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { RegisterDto } from "../auth/dto/register.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {
  }

  async getTokenizedUser(res: Response, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this._userModel.findOne({email: parsedToken.email})
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})
    return res.status(200).json(user)
  }

  async editTokenizedUser(res: Response, body: RegisterDto, token: string) {
    const parsedToken: JWTDecode = this.jwt.decode(token)
    if (!parsedToken)
      return res.status(404).json({message: 'Пользователь не найден'})
    const user = await this._userModel.findOne({email: parsedToken.email})
    if (!user)
      return res.status(404).json({message: 'Пользователь не найден'})

    let editedUser: any = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
    }

    if (user.company) {
      editedUser = {
        ...editedUser,
        companyInn: body.companyInn ? body.companyInn : null,
        companyOgrn: body.companyOgrn ? body.companyOgrn : null,
        companyKpp: body.companyKpp ? body.companyKpp : null,
        companyAddress: body.companyAddress ? body.companyAddress : null,
        companyName: body.companyName ? body.companyName : null
      }
    }

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      editedUser = {
        ...editedUser,
        password: hashedPassword
      }
    }

    const updatedUser = await this._userModel.findOneAndUpdate({email: parsedToken.email}, editedUser, {new: true})
    return res.status(200).json(updatedUser)
  }


  async getUsers() {
    return this._userModel.find()
  }

  async getUser(id: string) {
    return this._userModel.findById(id)
  }

  async getByEmail(email: string) {
    return this._userModel.findOne({email: email})
  }

  async createUser(dto: User) {
    return this._userModel.create(dto);
  }

}
