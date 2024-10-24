import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcryptjs';
import { UserDocument } from "../user/models/user.schema";
import { JWTDecode } from "../shared/interfaces/JWTDecode";


@Injectable()
export class AuthService {

  constructor(
    private jwt: JwtService,
    private user: UserService
  ) {}

  async registerUser(res: Response, dto: RegisterDto) {
    Logger.log(dto);
    if (!dto || !dto.firstName || !dto.lastName || !dto.email || !dto.password || dto.company === undefined) {
      return res.status(400).json({message: 'Проверьте введенные данные'})
    }


    const findUser = await this.user.getByEmail(dto.email);
    if (findUser)
      return res.status(403).json({message: 'Email уже существует в системе'})

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.user.createUser({
      ...dto,
      isAdmin: false,
      password: hashedPassword,
      companyInn: dto.companyInn ? dto.companyInn : null,
      companyOgrn: dto.companyOgrn ? dto.companyOgrn : null,
      companyKpp: dto.companyKpp ? dto.companyKpp : null,
      companyAddress: dto.companyAddress ? dto.companyAddress : null,
      companyName: dto.companyName ? dto.companyName : null
    });

    const token = await this.generateToken(user)

    return res.status(201).json(token)

  }

  async loginUser(res: Response, dto: LoginDto) {
    if (!dto || !dto.email || !dto.password) {
      return res.status(400).json({message: 'Проверьте введенные данные'})
    }

    const findUser = await this.user.getByEmail(dto.email);
    if (!findUser)
      return res.status(404).json({message: 'Пользователь не найден'})

    const passwordsEqual = await bcrypt.compare(dto.password, findUser.password);
    if (!passwordsEqual)
      return res.status(404).json({message: 'Неправильный пароль'})

    const token = await this.generateToken(findUser)
    return res.status(201).json(token)
  }

  async generateToken(user: UserDocument) {
    const tokenPayload: JWTDecode = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
    return this.jwt.signAsync(tokenPayload)
  }

}
