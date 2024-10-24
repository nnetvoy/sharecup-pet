import { Controller, Get, Headers, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { PrivateKeyService } from "./private-key.service";

@ApiTags('Private key for private user')
@Controller('private-key')
export class PrivateKeyController {

  constructor(private privateKeyService: PrivateKeyService) {
  }

  @Get('')
  @ApiOperation({summary: 'Получение существующего ключа'})
  @ApiResponse({status: 200})
  async getCurrentPrivateKey(@Headers('Authorization') token: string, @Res() res: Response) {
    return this.privateKeyService.getCurrentPrivateKey(res, token)
  }

  @Get('new')
  @ApiOperation({summary: 'Генерация нового ключа'})
  @ApiResponse({status: 200})
  async createNewPrivateKey(@Headers('Authorization') token: string, @Res() res: Response) {
    return this.privateKeyService.createNewPrivateKey(res, token)
  }

}
