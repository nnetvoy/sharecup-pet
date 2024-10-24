import { Body, Controller, Get, Headers, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { Response } from "express";
import { RegisterDto } from "../auth/dto/register.dto";


@ApiTags('Users Module')
@Controller('users')
export class UserController {

  constructor(private user: UserService) {
  }

  @Get('me')
  @ApiOperation({ summary: 'Получить пользователя по токену' })
  @ApiResponse({ status: 200 })
  async getCurrentUser(@Headers('Authorization') token: string, @Res() res: Response) {
    return this.user.getTokenizedUser(res, token);
  }

  @Post('me')
  @ApiOperation({ summary: 'Изменить пользователя по токену' })
  @ApiResponse({ status: 200 })
  async editCurrentUser(@Headers('Authorization') token: string, @Body() userDto: RegisterDto,  @Res() res: Response) {
    return this.user.editTokenizedUser(res, userDto, token);
  }





}
