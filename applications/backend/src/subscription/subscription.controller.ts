import { Body, Controller, Get, Headers, Patch, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { Response } from "express";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { InteractionClientCupsDto } from "./dto/interaction-client-cups.dto";
import { InteractionCompanyCupsDto } from "./dto/interaction-company-cups.dto";

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {

  constructor(private subscription: SubscriptionService) {
  }

  @Get('current')
  @ApiOperation({summary: 'Получить существующую подписку или её отсутствие'})
  @ApiResponse({status: 200})
  async getCurrentSubscription(@Res() res: Response, @Headers('Authorization') token:string) {
    return this.subscription.currentSubscription(token, res)
  }

  @Post('new')
  @ApiOperation({summary: 'Установить новую подписку'})
  @ApiResponse({status: 201})
  async setNewSubscription(@Body() dto: CreateSubscriptionDto, @Res() res: Response, @Headers('Authorization') token:string) {
    return this.subscription.create(dto, res, token)
  }

  // Для баристы
  @Patch('cups/private')
  @ApiOperation({summary: 'Привязать или отвязать стакан от клиента'})
  @ApiResponse({status: 200})
  async setInteractionWithPrivatePersonCups(@Headers('Authorization') token:string, @Body() dto: InteractionClientCupsDto, @Res() res: Response) {
    return this.subscription.cupsPrivateTurnover(token, res, dto)
  }


  @Patch('cups/company')
  @ApiOperation({summary: 'Заказать или сдать кружки'})
  @ApiResponse({status: 200})
  async setInteractionWithCompanyCups(@Headers('Authorization') token:string,  @Body() dto: InteractionCompanyCupsDto, @Res() res: Response) {
    return this.subscription.cupsCompanyTurnover(token, res, dto)
  }

  @Get('cups/company/statistic')
  @ApiOperation({summary: 'Получение статистики для баристы'})
  @ApiResponse({status: 200})
  async getStatisticCompanyCups(@Headers('Authorization') token:string, @Res() res: Response) {
    return this.subscription.getCompanyStatistic(token, res)
  }

  //   Для админа

  @Get('cups/admin')
  @ApiOperation({summary: 'Получение статистики для админа'})
  @ApiResponse({status: 200})
  async getAllStatisctic(@Headers('Authorization') token:string, @Res() res: Response) {
    return this.subscription.getAllStatistic(res, token)
  }

}
