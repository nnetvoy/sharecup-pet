import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {

  constructor(private auth: AuthService) {
  }

  @Post('')
  @ApiOperation({summary: 'Авторизация клиента'})
  @ApiResponse({status: 200})
  async authUser(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.auth.loginUser(res, loginDto)
  }

  @Post('registration')
  @ApiOperation({summary: 'Регистрация клиента'})
  @ApiResponse({status: 201})
  async registerUser(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return this.auth.registerUser(res, registerDto)
  }

}
