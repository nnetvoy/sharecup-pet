import { Module } from '@nestjs/common';
import { PrivateKeyService } from './private-key.service';
import { PrivateKeyController } from './private-key.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { PrivateKey, PrivateKeySchema } from "./schemas/private-key.schema";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'jashudIHA7w8RHQ@&#RHQ@R',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: PrivateKey.name, schema: PrivateKeySchema },
    ]),
  ],
  providers: [PrivateKeyService],
  controllers: [PrivateKeyController],
  exports: [PrivateKeyService]
})
export class PrivateKeyModule {}
